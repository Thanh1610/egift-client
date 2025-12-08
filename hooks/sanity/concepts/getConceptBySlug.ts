import { sanityClient } from "@/lib/sanity/client";
import type { SanityConcept, Concept } from "@/types/sanity";
import { ROUTES, getDetailUrl } from "@/config/constain";

/**
 * Helper: GROQ fragment để fetch blockContent với images
 */
const blockContentFragment = `[]{
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
}`;

/**
 * Fetch concept by slug từ Sanity
 * @param slug - Concept slug
 * @returns Promise<Concept | null> - Concept data or null if not found
 */
export const getConceptBySlug = async (slug: string): Promise<Concept | null> => {
  try {
    // Kiểm tra Sanity config
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.warn("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
      return null;
    }

    // GROQ query để fetch concept by slug
    const concept = await sanityClient.fetch<SanityConcept | null>(
      `*[_type == "concept" && slug.current == $slug && isActive == true][0] {
        _id,
        title,
        subtitle,
        headerContent${blockContentFragment},
        bodyContent${blockContentFragment},
        footerContent${blockContentFragment},
        applicationContent${blockContentFragment},
        description${blockContentFragment},
        image {
          asset -> {
            _id,
            url
          }
        },
        "slug": slug.current,
        "category": category->name,
        order,
        isActive,
        layoutType
      }`,
      { slug }
    );

    if (!concept) {
      return null;
    }

    // Merge các phần content để tạo description (backward compatibility)
    const bodyContent = concept.bodyContent || concept.description || [];
    const allContent = [
      ...(concept.headerContent || []),
      ...bodyContent,
      ...(concept.footerContent || []),
    ];

    // Transform data để match với component
    const transformedConcept: Concept = {
      id: concept._id,
      title: concept.title,
      subtitle: concept.subtitle,
      headerContent: concept.headerContent,
      bodyContent,
      footerContent: concept.footerContent,
      applicationContent: concept.applicationContent,
      description: allContent.length > 0 ? allContent : (concept.description || []),
      image: concept.image?.asset?.url || "",
      slug: concept.slug,
      category: concept.category,
      order: concept.order,
      isActive: concept.isActive,
      layoutType: concept.layoutType || "portrait",
      href: getDetailUrl(ROUTES.CONCEPTS, concept.slug),
    };

    return transformedConcept;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching concept by slug from Sanity:", errorMessage);
    return null;
  }
};

