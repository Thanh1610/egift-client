"use client";
import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HeroCarousel({ banners }: { banners: string[] }) {

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index} className="w-full">
            <Card className="border-none rounded-none">
              <CardContent className="flex h-[600px] items-center justify-center p-0 bg-gray-200 relative">
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 bg-background/80 hover:bg-background/90 border-border text-foreground backdrop-blur-sm" />
      <CarouselNext className="right-4 bg-background/80 hover:bg-background/90 border-border text-foreground backdrop-blur-sm" />
    </Carousel>
  );
}
