import { Metadata } from "next";
import { getInnerStories } from "@/hooks/sanity/home/getInnerStory";
import { ROUTES } from "@/config/constain";
import { generateListPageMetadata } from "@/lib/seo/generateMetadata";
import { generateItemListSchema } from "@/lib/seo/generateStructuredData";
import ListPageHeader from "@/components/organisms/list/ListPageHeader";
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";
import StoriesGrid from "@/app/egift365/stories";
import { initializeCategories } from "@/lib/constants/categories";
import CustomBreadcrumb from "@/components/organisms/navigation/CustomBreadcrumb";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";

export async function generateMetadata(): Promise<Metadata> {
  const stories = await getInnerStories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = `${baseUrl}${ROUTES.STORIES}`;
  
  // Rút gọn description trong khoảng 140-160 ký tự để tối ưu SEO
  const description = `Khám phá ${stories.length} câu chuyện nội tâm ý nghĩa, kể về bài học chân thật, tình thương, biết ơn và bao dung.`;

  return generateListPageMetadata({
    title: "Câu chuyện nội tâm - Những câu chuyện ý nghĩa",
    description,
    url,
    image: stories.length > 0 ? stories[0].image : undefined,
    imageAlt: stories.length > 0 ? stories[0].title : undefined,
  });
}

export default async function StoriesPage() {
  // Initialize categories từ Sanity
  await initializeCategories();
  
  const stories = await getInnerStories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";

  // Convert stories to ListItem format (convert description from PortableTextBlock[] to string)
  const listItems = stories.map((story) => ({
    id: story.id,
    title: story.title,
    description: portableTextToPlainText(story.description),
    image: story.image,
    slug: story.slug,
    category: story.category,
    href: story.href,
  }));

  // Structured Data for SEO - ItemList Schema
  const itemListSchema = generateItemListSchema({
    name: "Câu chuyện nội tâm",
    description: "Danh sách các câu chuyện nội tâm ý nghĩa cho cả trẻ em và người lớn",
    url: `${baseUrl}${ROUTES.STORIES}`,
    items: listItems,
    baseUrl,
  });

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataScript data={itemListSchema} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <CustomBreadcrumb
          items={[
            { label: "Câu chuyện nội tâm" }, // Current page
          ]}
        />
      </div>

      {/* Desktop header - hidden on mobile */}
      <ListPageHeader
        title="CÂU CHUYỆN NỘI TÂM"
        description="Những câu chuyện ngắn cho cả trẻ em và người lớn — kể về bài học chân thật, tình thương, biết ơn và bao dung"
        itemCount={stories.length}
      />

      {/* Stories Grid */}
      <StoriesGrid stories={stories} />
    </>
  );
}
