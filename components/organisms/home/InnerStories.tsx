import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import type { InnerStory } from "@/types/sanity";
import { getCategoryDisplay } from "@/lib/constants/categories";
import { ROUTES } from "@/config/constain";
import { portableTextToPlainText } from "@/lib/sanity/portableTextToPlainText";

type InnerStoriesProps = {
  stories: InnerStory[];
};

/**
 * Format số thành string với "k" notation
 * @param num - Số cần format
 * @returns Formatted string (vd: "1.2k", "380")
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}


export default function InnerStories({ stories }: InnerStoriesProps) {
  // Chỉ hiển thị 3 stories đầu tiên
  const displayedStories = stories.slice(0, 3);

  // Fallback nếu không có stories
  if (!stories || stories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-14 space-y-8" aria-labelledby="inner-stories-title">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-[0.2em]">
            Đọc & kể chuyện
          </Badge>
          <h2
            id="inner-stories-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            CÂU CHUYỆN NỘI TÂM
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Những câu chuyện ngắn cho cả trẻ em và người lớn — kể về bài học chân thật, tình thương,
            biết ơn và bao dung.
          </p>
        </div>
        <p className="text-center text-muted-foreground">
          Chưa có câu chuyện nào được thêm vào.
        </p>
      </section>
    );
  }
  return (
    <section className="container mx-auto px-4 py-14 space-y-8" aria-labelledby="inner-stories-title">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-[0.2em]">
          Đọc & kể chuyện
        </Badge>
        <h2
          id="inner-stories-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          CÂU CHUYỆN NỘI TÂM
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Những câu chuyện ngắn cho cả trẻ em và người lớn — kể về bài học chân thật, tình thương,
          biết ơn và bao dung.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {displayedStories.map((story) => (
          <Link key={story.id} href={story.href} className="block">
            <Card className="overflow-hidden bg-background transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="relative mb-3 h-52 w-full overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <Badge className="absolute left-3 top-3 bg-background/80 text-xs text-foreground">
                    {getCategoryDisplay(story.category)}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">{story.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-10">
                  {portableTextToPlainText(story.description) || "\u00A0"}
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(story.reads)} lượt đọc</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{formatNumber(story.likes)} likes</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href={ROUTES.STORIES}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Xem thêm →
        </Link>
      </div>
    </section>
  )
}


