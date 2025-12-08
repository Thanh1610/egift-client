import { sanityClient } from "@/lib/sanity/client";
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

    // GROQ query để fetch inner stories
    const stories = await sanityClient.fetch<SanityInnerStory[]>(`
      *[_type == "innerStory" && isActive == true] 
      | order(order asc) 
      {
        _id,
        title,
        category,
        image {
          asset -> {
            _id,
            url
          }
        },
        description,
        listenTime,
        reads,
        reactions,
        "slug": slug.current,
        order,
        isActive
      }
    `);

    // Transform data để match với component
    const transformedStories: InnerStory[] = stories.map((story) => ({
      id: story._id,
      title: story.title,
      category: story.category,
      image: story.image?.asset?.url || "",
      description: story.description,
      listenTime: story.listenTime,
      reads: story.reads,
      reactions: story.reactions,
      slug: story.slug,
      order: story.order,
      isActive: story.isActive,
      href: getDetailUrl(ROUTES.STORIES, story.slug),
    }));

    return transformedStories;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching inner stories from Sanity:", errorMessage);
    // Fallback về empty array nếu fetch fail
    return [];
  }
};