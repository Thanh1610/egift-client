import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type StoryStats = {
  likes: number;
  reads: number;
  isLiked: boolean;
  isBookmarked: boolean;
};

/**
 * Get story stats from database (read-only, no side effects)
 * Total queries: 3-4 (likes count, stats, optional user like/bookmark check)
 */
async function getStoryStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  userId?: string
): Promise<StoryStats> {
  // Count likes from story_likes table (1 query)
  const { count: likesCount } = await supabase
    .from("story_likes")
    .select("*", { count: "exact", head: true })
    .eq("story_slug", slug);

  // Get reads from story_stats table (1 query)
  const { data: stats } = await supabase
    .from("story_stats")
    .select("reads")
    .eq("story_slug", slug)
    .single();

  // Check if user liked/bookmarked this story (1-2 queries, only if userId provided)
  let isLiked = false;
  let isBookmarked = false;
  if (userId) {
    const [likeResult, profileResult] = await Promise.all([
      supabase
        .from("story_likes")
        .select("id")
        .eq("story_slug", slug)
        .eq("user_id", userId)
        .single(),
      supabase
        .from("profiles")
        .select("bookmarks")
        .eq("id", userId)
        .single(),
    ]);
    isLiked = !!likeResult.data;
    // Check if slug exists in bookmarks array
    const bookmarks = (profileResult.data?.bookmarks as string[]) || [];
    isBookmarked = bookmarks.includes(slug);
  }

  return {
    likes: likesCount || 0,
    reads: stats?.reads || 0,
    isLiked,
    isBookmarked,
  };
}

/**
 * Toggle like for a story and return updated stats
 * Total queries: 4 (check, delete/insert, count, update stats)
 * Returns: { likes, isLiked }
 */
async function toggleLike(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  userId: string
): Promise<{ likes: number; isLiked: boolean }> {
  // Check if user already liked (1 query)
  const { data: existingLike } = await supabase
    .from("story_likes")
    .select("id")
    .eq("story_slug", slug)
    .eq("user_id", userId)
    .single();

  if (existingLike) {
    // Unlike: delete the like (1 query)
    await supabase
      .from("story_likes")
      .delete()
      .eq("story_slug", slug)
      .eq("user_id", userId);
  } else {
    // Like: insert the like (1 query)
    await supabase.from("story_likes").insert({
      story_slug: slug,
      user_id: userId,
    });
  }

  // Count updated likes (1 query)
  const { count: likesCount } = await supabase
    .from("story_likes")
    .select("*", { count: "exact", head: true })
    .eq("story_slug", slug);

  // Update story_stats.likes (1 query - upsert)
  const { data: existingStats } = await supabase
    .from("story_stats")
    .select("id")
    .eq("story_slug", slug)
    .single();

  if (existingStats) {
    await supabase
      .from("story_stats")
      .update({ likes: likesCount || 0 })
      .eq("story_slug", slug);
  } else {
    await supabase.from("story_stats").insert({
      story_slug: slug,
      likes: likesCount || 0,
      reads: 0,
    });
  }

  return {
    likes: likesCount || 0,
    isLiked: !existingLike, // Toggle state
  };
}

/**
 * Toggle bookmark for a story (stored in profiles.bookmarks JSONB array)
 * Total queries: 2 (get current bookmarks, update)
 * Returns: { isBookmarked }
 */
async function toggleBookmark(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  userId: string
): Promise<{ isBookmarked: boolean }> {
  // Get current bookmarks (1 query)
  const { data: profile } = await supabase
    .from("profiles")
    .select("bookmarks")
    .eq("id", userId)
    .single();

  const currentBookmarks = (profile?.bookmarks as string[]) || [];
  const isBookmarked = currentBookmarks.includes(slug);

  let newBookmarks: string[];
  if (isBookmarked) {
    // Unbookmark: remove slug from array
    newBookmarks = currentBookmarks.filter((s) => s !== slug);
  } else {
    // Bookmark: add slug to array
    newBookmarks = [...currentBookmarks, slug];
  }

  // Update bookmarks (1 query)
  await supabase
    .from("profiles")
    .update({ bookmarks: newBookmarks })
    .eq("id", userId);

  return { isBookmarked: !isBookmarked };
}

/**
 * Increment read count
 * Total queries: 1-2 (check existing, update/insert)
 */
async function incrementRead(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string
): Promise<number> {
  // Check if record exists
  const { data: existing } = await supabase
    .from("story_stats")
    .select("reads, id")
    .eq("story_slug", slug)
    .single();

  if (existing) {
    // Calculate new value
    const newValue = (existing.reads || 0) + 1;

    // Update with new value
    const { data: updated, error } = await supabase
      .from("story_stats")
      .update({ reads: newValue })
      .eq("story_slug", slug)
      .select("reads")
      .single();

    if (error) throw error;
    return (updated?.reads as number) || newValue;
  } else {
    // Insert new record
    const { data: inserted, error } = await supabase
      .from("story_stats")
      .insert({
        story_slug: slug,
        likes: 0,
        reads: 1,
      })
      .select("reads")
      .single();

    if (error) throw error;
    return (inserted?.reads as number) || 1;
  }
}

/**
 * GET /api/stories/[slug]/stats
 * Fetch stats for a story by slug (read-only, no side effects)
 * Total queries: 3-4
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get stats (3-4 queries: likes count, stats, optional user like/bookmark check)
    const stats = await getStoryStats(supabase, slug, user?.id);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching story stats:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch story stats" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stories/[slug]/stats
 * Toggle like, toggle bookmark, or increment read for a story
 * Optimized: ~4-5 queries for like, ~2 queries for bookmark, ~2 queries for read
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { type } = body;

    if (!type || (type !== "like" && type !== "bookmark" && type !== "read")) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'like', 'bookmark', or 'read'" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Handle like (requires authentication)
    if (type === "like") {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: "Authentication required to like a story" },
          { status: 401 }
        );
      }

      // Toggle like and get updated stats (4 queries: check, delete/insert, count, update)
      const { likes, isLiked } = await toggleLike(supabase, slug, user.id);

      // Get other stats (1 query)
      const { data: stats } = await supabase
        .from("story_stats")
        .select("reads")
        .eq("story_slug", slug)
        .single();

      // Check if bookmarked (1 query)
      const { data: profile } = await supabase
        .from("profiles")
        .select("bookmarks")
        .eq("id", user.id)
        .single();
      const bookmarks = (profile?.bookmarks as string[]) || [];
      const isBookmarked = bookmarks.includes(slug);

      return NextResponse.json(
        {
          likes,
          reads: stats?.reads || 0,
          isLiked,
          isBookmarked,
        },
        { status: 200 }
      );
    } else if (type === "bookmark") {
      // Handle bookmark (requires authentication)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: "Authentication required to bookmark a story" },
          { status: 401 }
        );
      }

      // Toggle bookmark (2 queries: check, delete/insert)
      const { isBookmarked } = await toggleBookmark(supabase, slug, user.id);

      // Get all stats (2 queries: stats, likes count)
      const { data: stats } = await supabase
        .from("story_stats")
        .select("likes, reads")
        .eq("story_slug", slug)
        .single();

      const { count: likesCount } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);

      // Check if liked (1 query)
      const { data: like } = await supabase
        .from("story_likes")
        .select("id")
        .eq("story_slug", slug)
        .eq("user_id", user.id)
        .single();

      return NextResponse.json(
        {
          likes: likesCount || 0,
          reads: stats?.reads || 0,
          isLiked: !!like,
          isBookmarked,
        },
        { status: 200 }
      );
    } else {
      // Handle read (no authentication required, auto-increment)
      const newReads = await incrementRead(supabase, slug);

      // Get likes count
      const { count: likesCount } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);

      // Check if user liked/bookmarked (2 queries, only if authenticated)
      let isLiked = false;
      let isBookmarked = false;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const [likeResult, profileResult] = await Promise.all([
          supabase
            .from("story_likes")
            .select("id")
            .eq("story_slug", slug)
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("profiles")
            .select("bookmarks")
            .eq("id", user.id)
            .single(),
        ]);
        isLiked = !!likeResult.data;
        const bookmarks = (profileResult.data?.bookmarks as string[]) || [];
        isBookmarked = bookmarks.includes(slug);
      }

      return NextResponse.json(
        {
          likes: likesCount || 0,
          reads: newReads,
          isLiked,
          isBookmarked,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating story stats:", errorMessage);
    return NextResponse.json(
      { error: "Failed to update story stats" },
      { status: 500 }
    );
  }
}
