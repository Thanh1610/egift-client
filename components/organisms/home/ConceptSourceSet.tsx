import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type ConceptSource = {
  title: string;
  description: string;
  subDescription?: string;
  footerText?: string;
  image: string;
  href: string;
};

type JourneyCard = {
  title: string;
  duration: string;
  expectedResult: string;
  href: string;
};

const conceptSources: ConceptSource[] = [
  {
    title: "Khái niệm nguồn 1",
    description: "Mô tả ngắn gọn về khái niệm này và giá trị mà nó mang lại.",
    subDescription: "Thông tin bổ sung về khái niệm và cách áp dụng vào cuộc sống.",
    footerText: "Tìm hiểu thêm về khái niệm này",
    image:
      "https://file.hstatic.net/1000309554/file/25.11.23-lich-khung-anh-phoi-canh-2024-10_87dca63b6f0f4afe96b6e9f9fa331e25.jpg",
    href: "#concept-source-1",
  }
];

const journeyCards: JourneyCard[] = [
  {
    title: "Tên hành trình",
    duration: "10 ngày",
    expectedResult: "Kết quả mong đợi",
    href: "#journey-1",
  },
];

export default function ConceptSourceSet() {
  return (
    <section className="container mx-auto px-4 py-14 space-y-8" aria-labelledby="concept-source-title">
      <div className="text-center space-y-2">
        <h2
          id="concept-source-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
        >
          BỘ KHÁI NIỆM NGUỒN
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Concept Source Cards */}
        {conceptSources.map((item) => (
          <Card key={item.title} className="overflow-hidden bg-background w-full max-w-md">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 w-full md:h-auto md:w-1/2 overflow-hidden border-r">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4 space-y-2">
                  <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  {item.subDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.subDescription}</p>
                  )}
                  {item.footerText && (
                    <p className="text-xs text-muted-foreground mt-2">{item.footerText}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Journey Card */}
        {journeyCards.map((journey) => (
          <Card key={journey.title} className="overflow-hidden bg-background flex flex-col w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg leading-snug">{journey.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground">{journey.duration}</p>
              <p className="text-sm text-muted-foreground">{journey.expectedResult}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={journey.href}>
                  Khám phá Hành trình
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

