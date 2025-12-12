import { getCategories } from "@/hooks/sanity/categories/getCategories";

/**
 * Fallback mapping nếu không fetch được từ Sanity
 * (chỉ dùng khi Sanity chưa có categories)
 * Note: Hiện tại không sử dụng, nhưng giữ lại để có thể dùng sau này
 */
// const FALLBACK_CATEGORY_MAP: Record<string, string> = {};

// Cache để tránh fetch nhiều lần
let categoryMapCache: Record<string, string> | null = null;
let categoryMapPromise: Promise<Record<string, string>> | null = null;

/**
 * Get category map từ Sanity (với cache)
 * @returns Promise với category map
 */
async function getCategoryMap(): Promise<Record<string, string>> {
  // Nếu đã có cache, return ngay
  if (categoryMapCache) {
    return categoryMapCache;
  }

  // Nếu đang fetch, đợi promise đó
  if (categoryMapPromise) {
    return categoryMapPromise;
  }

  // Fetch từ Sanity
  categoryMapPromise = getCategories().then((map) => {
    // Map từ Sanity (name -> name)
    categoryMapCache = map;
    return categoryMapCache;
  });

  return categoryMapPromise;
}

/**
 * Get display text cho category (async)
 * @param category - Category name từ Sanity
 * @returns Promise với category name (vì name đã là display text)
 */
export async function getCategoryDisplayAsync(category: string): Promise<string> {
  const map = await getCategoryMap();
  // Nếu có trong map, trả về; nếu không, trả về category name trực tiếp
  return map[category] || category;
}

/**
 * Get display text cho category (sync - dùng fallback)
 * Dùng cho client components không thể async
 * @param category - Category name từ Sanity
 * @returns Category name (vì name đã là display text)
 */
export function getCategoryDisplay(category: string): string {
  // Nếu có cache và có mapping, dùng cache
  if (categoryMapCache && categoryMapCache[category]) {
    return categoryMapCache[category];
  }
  // Nếu chưa có cache, trả về category name trực tiếp (vì name đã là display text)
  return category;
}

/**
 * Initialize category map (gọi ở server component hoặc page)
 * Nên gọi ở layout hoặc page để preload categories
 */
export async function initializeCategories(): Promise<void> {
  await getCategoryMap();
}

