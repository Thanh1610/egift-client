"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Eye } from "lucide-react";
import type { InnerStory } from "@/types/sanity";
import { getCategoryDisplay } from "@/lib/constants/categories";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";

type StoriesGridProps = {
  stories: InnerStory[];
};

/**
 * Format số thành string với "k" notation
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function StoriesGrid({ stories }: StoriesGridProps) {
  // Hide header/footer on mobile for fullscreen experience
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile: hide header/footer
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const main = document.querySelector("main");
        if (header) header.style.display = "none";
        if (footer) footer.style.display = "none";
        if (main) main.style.marginTop = "0";
      } else {
        // Desktop: show header/footer
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");
        const main = document.querySelector("main");
        if (header) header.style.display = "";
        if (footer) footer.style.display = "";
        if (main) main.style.marginTop = "";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Empty state
  if (!stories || stories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-14 text-center" aria-label="Danh sách câu chuyện nội tâm">
        <p className="text-muted-foreground">Chưa có câu chuyện nào được thêm vào.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-14" aria-label="Danh sách câu chuyện nội tâm">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Link key={story.id} href={story.href} className="block">
            <Card className="overflow-hidden bg-background transition-shadow hover:shadow-md h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="relative mb-3 h-52 w-full overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <Badge className="absolute left-3 top-3 bg-background/80 text-xs">
                    {getCategoryDisplay(story.category)}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">{story.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {portableTextToPlainText(story.description)}
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{formatNumber(story.likes)} likes</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(story.reads)} lượt đọc</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
              
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}


