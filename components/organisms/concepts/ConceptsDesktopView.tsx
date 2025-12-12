import Link from "next/link";
import Image from "next/image";
import { ROUTES, getDetailUrl } from "@/config/constain";
import type { Concept } from "@/types/sanity";

type ConceptsDesktopViewProps = {
  concepts: Concept[];
};

export default function ConceptsDesktopView({ concepts }: ConceptsDesktopViewProps) {
  return (
    <section className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto px-4 pb-14" aria-label="Danh sách quan niệm">
      {concepts.map((concept) => {
        return (
          <article key={concept.id} className="group">
            <Link
              href={concept.href || getDetailUrl(ROUTES.CONCEPTS, concept.slug)}
              className="block h-full"
              aria-label={`Đọc quan niệm: ${concept.title}`}
            >
              <div className="bg-background/70 h-full overflow-hidden rounded-lg border flex flex-col transition-shadow hover:shadow-lg">
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={concept.image}
                    alt={`${concept.title} - Quan niệm sống về ${concept.category}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {concept.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1 italic min-h-16">
                    {concept.subtitle ? (
                      <>&quot;{concept.subtitle}&quot;</>
                    ) : (
                      <span className="invisible">&nbsp;</span>
                    )}
                  </p>
                  <span className="text-primary text-sm font-medium mt-3 group-hover:underline">
                    Xem thêm →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </section>
  );
}

