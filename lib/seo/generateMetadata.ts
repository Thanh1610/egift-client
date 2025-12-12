import { Metadata } from "next";

type GenerateMetadataOptions = {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
};

/**
 * Generate SEO metadata cho list pages
 * Tái sử dụng cho concepts, stories, và các trang list khác
 */
export function generateListPageMetadata({
  title,
  description,
  url,
  image,
  imageAlt,
}: GenerateMetadataOptions): Metadata {
  return {
    title: `${title} | Egift365`,
    description,
    openGraph: {
      title: `${title} | Egift365`,
      description,
      url,
      siteName: "Egift365",
      locale: "vi_VN",
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: imageAlt || title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Egift365`,
      description,
      images: image ? [image] : [],
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

