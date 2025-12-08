import { Metadata } from "next";
import { getConcepts } from "@/hooks/sanity/home/getConcepts";
import ConceptsGrid from "@/app/egift365/concepts";
import { ROUTES } from "@/config/constain";
import { generateListPageMetadata } from "@/lib/seo/generateMetadata";
import { generateItemListSchema } from "@/lib/seo/generateStructuredData";
import ListPageHeader from "@/components/organisms/list/ListPageHeader";
import StructuredDataScript from "@/components/organisms/list/StructuredDataScript";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";

export async function generateMetadata(): Promise<Metadata> {
  const concepts = await getConcepts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = `${baseUrl}${ROUTES.CONCEPTS}`;
  
  // Rút gọn description trong khoảng 140-160 ký tự để tối ưu SEO
  const description = `Khám phá ${concepts.length} quan niệm sống sâu sắc về tư duy, tài chính, mối quan hệ và phát triển bản thân.`;

  return generateListPageMetadata({
    title: "Kho quan niệm - Khám phá triết lý sống",
    description,
    url,
    image: concepts.length > 0 ? concepts[0].image : undefined,
    imageAlt: concepts.length > 0 ? concepts[0].title : undefined,
  });
}

export default async function ConceptsPage() {
  const concepts = await getConcepts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://egift365.vn";

  // Convert concepts to ListItem format (convert description from PortableTextBlock[] to string)
  const listItems = concepts.map((concept) => ({
    id: concept.id,
    title: concept.title,
    description: portableTextToPlainText(concept.description),
    image: concept.image,
    slug: concept.slug,
    category: concept.category,
    href: concept.href,
  }));

  // Structured Data for SEO - ItemList Schema
  const itemListSchema = generateItemListSchema({
    name: "Kho quan niệm",
    description: "Danh sách các quan niệm sống ý nghĩa giúp bạn phát triển bản thân",
    url: `${baseUrl}${ROUTES.CONCEPTS}`,
    items: listItems,
    baseUrl,
  });

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataScript data={itemListSchema} />

      {/* Desktop header - hidden on mobile */}
      <ListPageHeader
        title="KHO QUAN NIỆM"
        description="Khám phá quan niệm sống ý nghĩa, giúp bạn hiểu sâu hơn về bản thân và cuộc sống"
        itemCount={concepts.length}
      />

      {/* Mobile: Fullscreen scroll, Desktop: Grid */}
      <ConceptsGrid concepts={concepts} />
    </>
  );
}