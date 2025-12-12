import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

const BANNER_QUERY = `*[_type == "banner" && isActive == true][0] {
  _id,
  title,
  images[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt
  }
}`;

export type BannerImage = {
  url: string;
  alt?: string;
};

export async function getBanners(): Promise<BannerImage[]> {
  try {
    const banner = await sanityClient.fetch<{
      _id: string;
      title: string;
      images?: Array<{
        asset: {
          _id: string;
          url: string;
          metadata?: {
            dimensions?: {
              width: number;
              height: number;
            };
          };
        };
        alt?: string;
      }>;
    }>(BANNER_QUERY);

    if (!banner || !banner.images || banner.images.length === 0) {
      return [];
    }

    return banner.images.map((image) => ({
      url: urlFor(image.asset).url(),
      alt: image.alt || `Banner ${banner.title}`,
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

