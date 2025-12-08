import HeroCarousel from "@/components/organisms/home/HeroCarousel";
import ConceptLibrary from "@/components/organisms/home/ConceptLibrary";
import InnerStories from "@/components/organisms/home/InnerStories";
import ConceptSourceSet from "@/components/organisms/home/ConceptSourceSet";
import CommunitySpreaders from "@/components/organisms/home/CommunitySpreaders";
import { Separator } from "@/components/ui/separator";
import { getConcepts } from "@/hooks/sanity/home/getConcepts";
import { getInnerStories } from "@/hooks/sanity/home/getInnerStory";
import { getBanners } from "@/hooks/sanity/home/getBanners";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ | Egift365",
  description: "Trang chủ | Egift365",
};

export default async function Home() {
  const [concepts, innerStories, banners] = await Promise.all([
    getConcepts(),
    getInnerStories(),
    getBanners(),
  ]);

  return (
    <div className="w-full bg-card border shadow-sm">
      {/* banner */}
      {banners.length > 0 && <HeroCarousel banners={banners.map(b => b.url)} />}

      {/* kho quan niệm*/}
      <ConceptLibrary concepts={concepts} />
      <Separator />

      {/* câu chuyện nội tâm*/}
      <InnerStories stories={innerStories} />
      <Separator />

      {/* bộ khái niệm nguồn*/}
      <ConceptSourceSet />
      <Separator />

      {/* cộng đồng lan tỏa*/}
      <CommunitySpreaders />
      <Separator />
    </div>
  );
}

