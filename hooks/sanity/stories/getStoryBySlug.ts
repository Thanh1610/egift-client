import { sanityClient } from "@/lib/sanity/client";
import { createClient } from "@/lib/supabase/server";
import type { SanityInnerStory, InnerStory } from "@/types/sanity";
import { ROUTES, getDetailUrl } from "@/config/constain";

/**
 * Fetch inner story by slug từ Sanity và stats từ Supabase
 * @param slug - Story slug
 * @returns Promise<InnerStory | null> - Story data or null if not found
 */
export const getStoryBySlug = async (slug: string): Promise<InnerStory | null> => {
  try {
    // Kiểm tra Sanity config
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
      return null;
    }

    // GROQ query để fetch story by slug với blockContent
    const story = await sanityClient.fetch<SanityInnerStory | null>(
      `*[_type == "innerStory" && slug.current == $slug && isActive == true][0] {
        _id,
        title,
        "category": category->name,
        image {
          asset -> {
            _id,
            url
          }
        },
        description[]{
          ...,
          _type == "image" => {
            ...,
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            }
          }
        },
        listenTime,
        "slug": slug.current,
        order,
        isActive
      }`,
      { slug }
    );

    if (!story) {
      return null;
    }

    // Fetch stats từ Supabase
    let likes = 0;
    let reads = 0;
    try {
      const supabase = await createClient();
      
      // Count likes from story_likes table (source of truth)
      const { count: likesCount } = await supabase
        .from("story_likes")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", slug);
      
      // Fetch other stats from story_stats
      const { data: stats } = await supabase
        .from("story_stats")
        .select("reads")
        .eq("story_slug", slug)
        .single();

      likes = likesCount || 0;
      if (stats) {
        reads = stats.reads || 0;
      }
    } catch (statsError) {
      // Nếu không fetch được stats, dùng default values
      console.warn("Failed to fetch story stats from Supabase:", statsError);
    }

    // Transform data để match với component
    const transformedStory: InnerStory = {
      id: story._id,
      title: story.title,
      category: story.category,
      image: story.image?.asset?.url || "",
      description: story.description,
      listenTime: story.listenTime,
      likes,
      bookmarks: 0, // Deprecated: bookmarks are now user-specific
      reads,
      slug: story.slug,
      order: story.order,
      isActive: story.isActive,
      href: getDetailUrl(ROUTES.STORIES, story.slug),
    };

    return transformedStory;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching story by slug from Sanity:", errorMessage);
    return null;
  }
};

