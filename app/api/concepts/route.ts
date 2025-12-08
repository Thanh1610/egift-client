import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { ROUTES, getDetailUrl } from "@/config/constain";

/**
 * API Route để fetch concepts từ Sanity
 * GET /api/concepts
 */
export async function GET() {
  try {
    // Kiểm tra Sanity client config
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
      return NextResponse.json(
        { error: "Sanity project ID not configured" },
        { status: 500 }
      );
    }

    // GROQ query để fetch concepts
    const concepts = await sanityClient.fetch(`
      *[_type == "concept" && isActive == true] 
      | order(order asc) 
      {
        _id,
        title,
        description,
        image {
          asset -> {
            _id,
            url
          }
        },
        "slug": slug.current,
        category,
        order,
        isActive
      }
    `);

    console.log("Fetched concepts:", concepts.length);

    // Transform data để match với component
    type Concept = {
      _id: string;
      title: string;
      description: string;
      image?: { asset?: { url?: string } };
      slug: string;
      category: string;
      order?: number;
      isActive?: boolean;
    };
    
    const transformedConcepts = concepts.map((concept: Concept) => ({
      id: concept._id,
      title: concept.title,
      description: concept.description,
      image: concept.image?.asset?.url || "",
      slug: concept.slug,
      category: concept.category,
      order: concept.order,
      isActive: concept.isActive,
      href: getDetailUrl(ROUTES.CONCEPTS, concept.slug),
    }));

    return NextResponse.json(transformedConcepts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching concepts:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { 
        error: "Failed to fetch concepts",
        message: errorMessage,
        details: errorStack 
      },
      { status: 500 }
    );
  }
}

