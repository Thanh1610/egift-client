# SEO Utilities - Hướng dẫn sử dụng

Các utilities tái sử dụng cho SEO, giúp tạo list pages nhanh chóng và consistent.

## Các utilities có sẵn

### 1. `generateListPageMetadata()`
Tạo metadata cho list pages (concepts, stories, etc.)

```typescript
import { generateListPageMetadata } from "@/lib/seo/generateMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const items = await getItems();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";
  const url = `${baseUrl}${ROUTES.ITEMS}`;
  
  // Description: 140-160 ký tự
  const description = `Mô tả ngắn gọn về ${items.length} items...`;

  return generateListPageMetadata({
    title: "Page Title",
    description,
    url,
    image: items.length > 0 ? items[0].image : undefined,
    imageAlt: items.length > 0 ? items[0].title : undefined,
  });
}
```

### 2. `generateItemListSchema()`
Tạo structured data (JSON-LD) cho ItemList

```typescript
import { generateItemListSchema } from "@/lib/seo/generateStructuredData";

const itemListSchema = generateItemListSchema({
  name: "List Name",
  description: "List description",
  url: `${baseUrl}${ROUTES.ITEMS}`,
  items: items, // Array of items với: id, title, description, image, slug, category, href
  baseUrl,
});
```

### 3. `ListPageHeader`
Component header cho desktop view

```typescript
import ListPageHeader from "@/components/organisms/list/ListPageHeader";

<ListPageHeader
  title="PAGE TITLE"
  description="Mô tả ngắn về trang"
  itemCount={items.length}
/>
```

### 4. `StructuredDataScript`
Component để render structured data

```typescript
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";

<StructuredDataScript data={itemListSchema} />
```

## Ví dụ: Tạo Stories Page

```typescript
// app/egift365/stories/page.tsx
import { Metadata } from "next";
import { getInnerStories } from "@/hooks/sanity/home/getInnerStory";
import StoriesGrid from "@/components/organisms/stories";
import { ROUTES } from "@/config/constain";
import { generateListPageMetadata } from "@/lib/seo/generateMetadata";
import { generateItemListSchema } from "@/lib/seo/generateStructuredData";
import ListPageHeader from "@/components/organisms/list/ListPageHeader";
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";

export async function generateMetadata(): Promise<Metadata> {
  const stories = await getInnerStories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";
  const url = `${baseUrl}${ROUTES.STORIES}`;
  
  const description = `Khám phá ${stories.length} câu chuyện nội tâm sâu sắc về cuộc sống, tình yêu và phát triển bản thân.`;

  return generateListPageMetadata({
    title: "Câu chuyện nội tâm",
    description,
    url,
    image: stories.length > 0 ? stories[0].image : undefined,
    imageAlt: stories.length > 0 ? stories[0].title : undefined,
  });
}

export default async function StoriesPage() {
  const stories = await getInnerStories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";

  const itemListSchema = generateItemListSchema({
    name: "Câu chuyện nội tâm",
    description: "Danh sách các câu chuyện nội tâm ý nghĩa",
    url: `${baseUrl}${ROUTES.STORIES}`,
    items: stories,
    baseUrl,
  });

  return (
    <>
      <StructuredDataScript data={itemListSchema} />
      <ListPageHeader
        title="CÂU CHUYỆN NỘI TÂM"
        description="Khám phá những câu chuyện sâu sắc về cuộc sống"
        itemCount={stories.length}
      />
      <StoriesGrid stories={stories} />
    </>
  );
}
```

## Lợi ích

✅ **DRY**: Không lặp code metadata và structured data  
✅ **Consistent**: Tất cả list pages có cùng structure  
✅ **SEO Optimized**: Tuân thủ best practices  
✅ **Type Safe**: TypeScript types đầy đủ  
✅ **Maintainable**: Dễ update và fix bugs  

## Requirements

Items phải có structure:
```typescript
{
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  category: string;
  href: string;
}
```

