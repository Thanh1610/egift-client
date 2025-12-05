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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const concepts = [
  {
    title: 'Nội tâm',
    description: 'Hiểu mình sâu sắc để sống an yên mỗi ngày.',
    href: '#concept-inner',
    image:
      'https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg',
  },
  {
    title: 'Sức khỏe',
    description: 'Cân bằng thân - tâm, nuôi dưỡng sức khỏe bền vững.',
    href: '#concept-health',
    image:
      'https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-12_92fdb697ac5f40a68fab6ee93b614d80.jpg',
  },
  {
    title: 'Mối quan hệ',
    description: 'Kết nối chân thật, xây dựng mối quan hệ lành mạnh.',
    href: '#concept-relationship',
    image:
      'https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-8_390ff9aaa1fe4a1c95bf148199706e1e.jpg',
  },
  {
    title: 'Tài chính',
    description: 'Quản trị tài chính thông minh để sống tự do, an tâm.',
    href: '#concept-finance',
    image:
      'https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg',
  },
  {
    title: 'Tri Thức',
    description: 'Tìm hiểu thế giới một cách sâu sắc, khám phá tri thức mới.',
    href: '#concept-knowledge',
    image:
      'https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg',
  },
];

export default function ConceptLibrary() {
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
          Kho quan niệm
        </h2>
      </div>

      <Carousel className="mx-auto w-full max-w-6xl">
        <CarouselContent className="-ml-3">
          {concepts.map(item => (
            <CarouselItem
              key={item.title}
              className="pl-3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="bg-background/70 h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">
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
                      className="h-full w-full object-cover"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-muted-foreground line-clamp-2 cursor-help text-left text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="start"
                        className="max-w-xs text-left text-sm"
                      >
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardContent>
                <CardFooter>
                  <Link
                    href={item.href}
                    className="text-primary focus-visible:ring-primary rounded-sm text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Xem thêm
                  </Link>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-background/80 border-border absolute top-1/2 left-2 z-10 -translate-y-1/2 border opacity-40 shadow-sm backdrop-blur-sm hover:opacity-100 md:opacity-100" />
        <CarouselNext className="bg-background/80 border-border absolute top-1/2 right-2 z-10 -translate-y-1/2 border opacity-40 shadow-sm backdrop-blur-sm hover:opacity-100 md:opacity-100" />
      </Carousel>
    </section>
  );
}
