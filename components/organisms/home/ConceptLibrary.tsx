import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ROUTES, getDetailUrl } from '@/config/constain';
import { portableTextToPlainText } from '@/lib/sanity/portableTextToPlainText';
import type { Concept } from '@/types/sanity';

type ConceptLibraryProps = {
  concepts: Concept[];
};

export default function ConceptLibrary({ concepts }: ConceptLibraryProps) {
  // Fallback nếu không có concepts
  if (!concepts || concepts.length === 0) {
    return (
      <section
        className="container mx-auto space-y-8 px-4 py-14"
        aria-labelledby="concept-library-title"
      >
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
            Mời quan niệm
          </p>
          <h2
            id="concept-library-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            KHO QUAN NIỆM
          </h2>
        </div>
        <p className="text-center text-muted-foreground">
          Chưa có quan niệm nào được thêm vào.
        </p>
      </section>
    );
  }
  return (
    <section
      className="container mx-auto space-y-8 px-4 py-14"
      aria-labelledby="concept-library-title"
    >
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
          Mời quan niệm
        </p>
        <h2
          id="concept-library-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          KHO QUAN NIỆM
        </h2>
      </div>

      <Carousel className="mx-auto w-full max-w-6xl">
        <CarouselContent className="-ml-3">
          {concepts.map(item => {
            // Convert PortableTextBlock[] to plain text for display
            const descriptionText = portableTextToPlainText(item.description);
            return (
              <CarouselItem
                key={item.title}
                className="pl-3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Card className="group bg-background/70 h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted aspect-4/3 w-full overflow-hidden rounded-md border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <p className="text-muted-foreground line-clamp-2 min-h-10 text-left text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                      {descriptionText || "\u00A0"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={item.href || getDetailUrl(ROUTES.CONCEPTS, item.slug)}
                      className="text-primary focus-visible:ring-primary rounded-sm text-sm font-medium transition-all duration-300 hover:underline hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none inline-flex items-center gap-1"
                    >
                      Xem thêm{" "}
                      <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">
                        →
                      </span>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="bg-background/80 border-border absolute top-1/2 left-2 z-10 -translate-y-1/2 border opacity-40 shadow-sm backdrop-blur-sm hover:opacity-100 md:opacity-100" />
        <CarouselNext className="bg-background/80 border-border absolute top-1/2 right-2 z-10 -translate-y-1/2 border opacity-40 shadow-sm backdrop-blur-sm hover:opacity-100 md:opacity-100" />
      </Carousel>
    </section>
  );
}
