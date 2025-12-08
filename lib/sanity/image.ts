import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

/**
 * Helper function để tạo URL cho Sanity images
 * @param source - Sanity image source
 * @returns Image URL builder
 */
export function urlFor(source: unknown) {
  return builder.image(source);
}

