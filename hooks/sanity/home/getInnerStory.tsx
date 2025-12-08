import { sanityClient } from "@/lib/sanity/client";
import { createClient } from "@/lib/supabase/server";
import type { SanityInnerStory, InnerStory } from "@/types/sanity";
import { ROUTES, getDetailUrl } from "@/config/constain";


/**
 * Fetch inner stories từ Sanity
 * @returns Promise<InnerStory[]> - Array of transformed inner stories
 */
export const getInnerStories = async (): Promise<InnerStory[]> => {
  try {
    // Kiểm tra Sanity config
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
      return [];
    }

    // GROQ query để fetch inner stories (không lấy reads và reactions nữa)
    const stories = await sanityClient.fetch<SanityInnerStory[]>(`
      *[_type == "innerStory" && isActive == true] 
      | order(order asc) 
      {
        _id,
        title,
        "category": category->name,
        image {
          asset -> {
            _id,
            url
          }
        },
        description,
        "slug": slug.current,
        order,
        isActive
      }
    `);

    // Fetch stats từ Supabase cho tất cả stories
    const supabase = await createClient();
    const slugs = stories.map((story) => story.slug);
    
    // Count likes from story_likes table for all stories
    const likesPromises = slugs.map(async (slug) => {
      const { count } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);
      return { slug, likes: count || 0 };
    });
    const likesData = await Promise.all(likesPromises);
    const likesMap = new Map(likesData.map((item) => [item.slug, item.likes]));
    
    // Fetch other stats from story_stats
    const { data: statsData } = await supabase
      .from("story_stats")
      .select("story_slug, reads")
      .in("story_slug", slugs);

    // Create a map for quick lookup
    const statsMap = new Map(
      (statsData || []).map((stat) => [
        stat.story_slug,
        {
          likes: likesMap.get(stat.story_slug) || 0,
          reads: stat.reads || 0,
        },
      ])
    );
    
    // Add stories that don't have stats yet
    slugs.forEach((slug) => {
      if (!statsMap.has(slug)) {
        statsMap.set(slug, {
          likes: likesMap.get(slug) || 0,
          reads: 0,
        });
      }
    });

    // Transform data để match với component
    const transformedStories: InnerStory[] = stories.map((story) => {
      const stats = statsMap.get(story.slug) || {
        likes: 0,
        reads: 0,
      };
      return {
        id: story._id,
        title: story.title,
        category: story.category,
        image: story.image?.asset?.url || "",
        description: story.description,
        listenTime: story.listenTime,
        likes: stats.likes,
        bookmarks: 0, // Deprecated: bookmarks are now user-specific
        reads: stats.reads,
        slug: story.slug,
        order: story.order,
        isActive: story.isActive,
        href: getDetailUrl(ROUTES.STORIES, story.slug),
      };
    });

    return transformedStories;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching inner stories from Sanity:", errorMessage);
    // Fallback về empty array nếu fetch fail
    return [];
  }
};