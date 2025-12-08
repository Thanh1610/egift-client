import { createClient } from "next-sanity";

/**
 * Sanity Client cho egift-client
 * Chỉ dùng để đọc data (read-only)
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  console.warn("⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity client will not work.");
}

export const sanityClient = createClient({
  projectId: projectId || "",
  dataset: dataset,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production", // Sử dụng CDN trong production
});

