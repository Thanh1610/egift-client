import HeroCarousel from "@/components/organisms/home/HeroCarousel";
import DailySection from "@/components/organisms/home/DailySection";
import ConceptLibrary from "@/components/organisms/home/ConceptLibrary";
import InnerStories from "@/components/organisms/home/InnerStories";
import ConceptSourceSet from "@/components/organisms/home/ConceptSourceSet";
import CommunitySpreaders from "@/components/organisms/home/CommunitySpreaders";
import {Separator} from "@/components/ui/separator";

const banners = [
  "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg",
  "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-12_92fdb697ac5f40a68fab6ee93b614d80.jpg",
  "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-8_390ff9aaa1fe4a1c95bf148199706e1e.jpg",
];

export default function Home() {
  return (
    <main className="w-full mt-[100px] bg-card border shadow-sm">
      {/* banner */}
      <HeroCarousel banners={banners} />

      {/* quan niệm hôm nay*/}
      <DailySection />
      <Separator />

      {/* kho quan niệm*/}
      <ConceptLibrary />
      <Separator />

      {/* câu chuyện nội tâm*/}
      <InnerStories />
      <Separator />

      {/* bộ khái niệm nguồn*/}
      <ConceptSourceSet />
      <Separator />

      {/* cộng đồng lan tỏa*/}
      <CommunitySpreaders />
      <Separator />
    </main>
  );
}
