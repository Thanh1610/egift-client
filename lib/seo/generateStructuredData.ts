type ListItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  category: string;
  href: string;
};

type GenerateItemListSchemaOptions = {
  name: string;
  description: string;
  url: string;
  items: ListItem[];
  baseUrl: string;
};

/**
 * Generate ItemList structured data schema
 * Tái sử dụng cho concepts, stories, và các trang list khác
 */
export function generateItemListSchema({
  name,
  description,
  url,
  items,
  baseUrl,
}: GenerateItemListSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        "@id": `${baseUrl}${item.href}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}${item.href}`,
        },
        name: item.title,
        description: item.description,
        image: item.image,
        url: `${baseUrl}${item.href}`,
        articleSection: item.category,
      },
    })),
  };
}

