import { sanityClient } from '@/lib/sanity/client';
import type { SanityConcept, Concept } from '@/types/sanity';
import { ROUTES, getDetailUrl } from '@/config/constain';

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
 * Transform SanityConcept to Concept
 */
const transformConcept = (concept: SanityConcept): Concept => {
  const bodyContent = concept.bodyContent || concept.description || [];
  const allContent = [
    ...(concept.headerContent || []),
    ...bodyContent,
    ...(concept.footerContent || []),
  ];

  return {
    id: concept._id,
    title: concept.title,
    subtitle: concept.subtitle,
    headerContent: concept.headerContent,
    bodyContent,
    footerContent: concept.footerContent,
    applicationContent: concept.applicationContent,
    description: allContent.length > 0 ? allContent : concept.description || [],
    image: concept.image?.asset?.url || '',
    backgroundImage: concept.backgroundImage?.asset?.url,
    slug: concept.slug,
    category: concept.category,
    order: concept.order,
    isActive: concept.isActive,
    layoutType: concept.layoutType || 'portrait',
    href: getDetailUrl(ROUTES.CONCEPTS, concept.slug),
  };
};

/**
 * Fetch concepts từ Sanity
 * @returns Promise<Concept[]> - Array of transformed concepts
 */
export const getConcepts = async (): Promise<Concept[]> => {
  try {
    // Kiểm tra Sanity config
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
      return [];
    }

    // GROQ query để fetch concepts
    const concepts = await sanityClient.fetch<SanityConcept[]>(`
      *[_type == "concept" && isActive == true] 
      | order(order asc) 
      {
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
        backgroundImage {
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
      }
    `);

    // Transform data để match với component
    return concepts.map(transformConcept);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching concepts from Sanity:', errorMessage);
    // Fallback về empty array nếu fetch fail
    return [];
  }
};
