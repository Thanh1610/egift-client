import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoryBySlug } from "@/hooks/sanity/stories/getStoryBySlug";
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";
import StoryDetailContent from "@/components/organisms/stories/StoryDetailContent";
import { initializeCategories } from "@/lib/constants/categories";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";
import CustomBreadcrumb from "@/components/organisms/navigation/CustomBreadcrumb";
import { ROUTES } from "@/config/constain";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Không tìm thấy | Egift365",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";
  const url = `${baseUrl}${story.href}`;
  
  // Description: 140-160 ký tự (convert from PortableText)
  const descriptionText = portableTextToPlainText(story.description);
  const description = descriptionText.length > 160 
    ? `${descriptionText.substring(0, 157)}...`
    : descriptionText;

  return {
    title: `${story.title} | Egift365`,
    description,
    openGraph: {
      title: `${story.title} | Egift365`,
      description,
      url,
      siteName: "Egift365",
      locale: "vi_VN",
      type: "article",
      images: story.image
        ? [
            {
              url: story.image,
              width: 1200,
              height: 630,
              alt: story.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} | Egift365`,
      description,
      images: story.image ? [story.image] : [],
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

export default async function StoryDetailPage({ params }: Props) {
  // Initialize categories từ Sanity
  await initializeCategories();
  
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";

  // Description for structured data (convert from PortableText)
  const descriptionText = portableTextToPlainText(story.description);

  // Structured Data for SEO - Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${baseUrl}${story.href}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${story.href}`,
    },
    headline: story.title,
    description: descriptionText,
    image: story.image,
    articleSection: story.category,
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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <CustomBreadcrumb
          items={[
            { label: "Câu chuyện nội tâm", href: ROUTES.STORIES },
            { label: story.title }, // Current page
          ]}
        />
      </div>

      {/* Story Detail Content */}
      <StoryDetailContent story={story} />
    </>
  );
}

