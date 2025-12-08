import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConceptBySlug } from "@/hooks/sanity/concepts/getConceptBySlug";
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";
import ConceptDetailContent from "@/components/organisms/concepts/ConceptDetailContent";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = await getConceptBySlug(slug);

  if (!concept) {
    return {
      title: "Không tìm thấy | Egift365",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";
  const url = `${baseUrl}${concept.href}`;
  
  // Convert blockContent to plain text for metadata
  const plainTextDescription = portableTextToPlainText(concept.description);
  // Description: 140-160 ký tự
  const description = plainTextDescription.length > 160 
    ? `${plainTextDescription.substring(0, 157)}...`
    : plainTextDescription;

  return {
    title: `${concept.title} | Egift365`,
    description,
    openGraph: {
      title: `${concept.title} | Egift365`,
      description,
      url,
      siteName: "Egift365",
      locale: "vi_VN",
      type: "article",
      images: concept.image
        ? [
            {
              url: concept.image,
              width: 1200,
              height: 630,
              alt: concept.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${concept.title} | Egift365`,
      description,
      images: concept.image ? [concept.image] : [],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ConceptDetailPage({ params }: Props) {
  const { slug } = await params;
  const concept = await getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";

  // Structured Data for SEO - Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${baseUrl}${concept.href}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${concept.href}`,
    },
    headline: concept.title,
    description: portableTextToPlainText(concept.description),
    image: concept.image,
    articleSection: concept.category,
    author: {
      "@type": "Organization",
      name: "Egift365",
    },
    publisher: {
      "@type": "Organization",
      name: "Egift365",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/egift365.svg`,
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataScript data={articleSchema} />

      {/* Concept Detail Content with Reveal Overlay */}
      <ConceptDetailContent concept={concept} />
    </>
  );
}

