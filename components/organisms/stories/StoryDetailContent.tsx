"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Heart, Bookmark, Eye } from "lucide-react";
import { getCategoryDisplay } from "@/lib/constants/categories";
import type { InnerStory } from "@/types/sanity";
import {
  useStoryStats,
  useToggleLike,
  useToggleBookmark,
  useIncrementRead,
} from "@/hooks/stories/useStoryStats";
import ConceptRichText from "@/components/organisms/concepts/ConceptRichText";

type Props = {
  story: InnerStory;
};

export default function StoryDetailContent({ story }: Props) {
  const { data: stats } = useStoryStats(story.slug);
  const toggleLikeMutation = useToggleLike(story.slug);
  const toggleBookmarkMutation = useToggleBookmark(story.slug);
  const incrementReadMutation = useIncrementRead(story.slug);

  // Auto-increment read count when page loads (only once)
  useEffect(() => {
    incrementReadMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Use stats from API or fallback to story props
  const likes = stats?.likes ?? story.likes;
  const reads = stats?.reads ?? story.reads;
  const isLiked = stats?.isLiked ?? false;
  const isBookmarked = stats?.isBookmarked ?? false;
  const isLoadingLike = toggleLikeMutation.isPending;
  const isLoadingBookmark = toggleBookmarkMutation.isPending;

  const handleLike = () => {
    toggleLikeMutation.mutate();
  };

  const handleBookmark = () => {
    toggleBookmarkMutation.mutate();
  };

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Card Container */}
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          {/* Category Badge */}
          <div>
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {getCategoryDisplay(story.category)}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-black uppercase tracking-wide md:text-4xl lg:text-5xl leading-tight">
            {story.title}
          </h1>

          {/* Image */}
          {story.image && (
            <div className="relative -mx-6 mt-4 aspect-video w-[calc(100%+3rem)] overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm" className="flex-wrap">
            <ToggleGroupItem
              value="likes"
              aria-label="Likes"
              className={`data-[state=on]:bg-transparent cursor-pointer ${
                isLiked ? "data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500" : ""
              }`}
              onClick={handleLike}
              disabled={isLoadingLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span className="font-medium">Likes:</span>
              <span>{likes.toLocaleString("vi-VN")}</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="reads"
              aria-label="Lượt đọc"
              className="data-[state=on]:bg-transparent"
            >
              <Eye className="h-4 w-4" />
              <span className="font-medium">Lượt đọc:</span>
              <span>{reads.toLocaleString("vi-VN")}</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bookmark"
              aria-label="Bookmark"
              className={`data-[state=on]:bg-transparent cursor-pointer ${
                isBookmarked ? "data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500" : ""
              }`}
              onClick={handleBookmark}
              disabled={isLoadingBookmark}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />
              <span className="font-medium">Lưu</span>
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Separator */}
          <Separator />

          {/* Description with Accordion */}
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline py-2">
                Nội dung
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ConceptRichText content={story.description} className="dark:prose-invert" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </article>
  );
}
