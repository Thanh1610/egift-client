import { sanityClient } from "@/lib/sanity/client";

const CATEGORIES_QUERY = `*[_type == "category" && isActive == true] | order(order asc) {
  _id,
  name,
  order,
  isActive
}`;

export type Category = {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
};

/**
 * Fetch categories từ Sanity và build mapping table
 * @returns Promise với category map: { [name]: name } (để tương thích với getCategoryDisplay)
 */
export async function getCategories(): Promise<Record<string, string>> {
  try {
    const categories = await sanityClient.fetch<Array<{
      _id: string;
      name: string;
      order: number;
      isActive: boolean;
    }>>(CATEGORIES_QUERY);

    // Build mapping table: name -> name (để tương thích với getCategoryDisplay)
    const categoryMap: Record<string, string> = {};
    categories.forEach((category) => {
      if (category.name) {
        categoryMap[category.name] = category.name;
      }
    });

    return categoryMap;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching categories from Sanity:", errorMessage);
    // Fallback về empty object nếu fetch fail
    return {};
  }
}

