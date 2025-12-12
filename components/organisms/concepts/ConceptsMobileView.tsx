"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES, getDetailUrl } from "@/config/constain";
import type { Concept } from "@/types/sanity";

type ConceptsMobileViewProps = {
  concepts: Concept[];
};

export default function ConceptsMobileView({ concepts }: ConceptsMobileViewProps) {
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

  return (
    <div className="md:hidden fixed inset-0 top-0 left-0 right-0 bottom-0 overflow-y-scroll snap-y snap-mandatory bg-black z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {concepts.map((concept, index) => {
        return (
          <div
            key={concept.id}
            className="snap-start snap-always h-screen w-full relative flex items-end"
          >
            {/* Fullscreen image */}
            <div className="absolute inset-0">
              <Image
                src={concept.image}
                alt={`${concept.title} - Quan niệm sống ý nghĩa về ${concept.category}`}
                fill
                priority={index < 3}
                className="object-contain"
                sizes="100vw"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden="true" />
            </div>

            {/* Content overlay */}
            <article className="relative z-10 w-full p-6 pb-20 text-white">
              <h2 className="text-2xl font-bold mb-3 leading-tight text-white">
                {concept.title}
              </h2>
              <p className="text-base leading-relaxed mb-4 text-white italic line-clamp-2 min-h-16">
                {concept.subtitle ? (
                  <>&quot;{concept.subtitle}&quot;</>
                ) : (
                  <span className="invisible">&nbsp;</span>
                )}
              </p>
              <Link
                href={concept.href || getDetailUrl(ROUTES.CONCEPTS, concept.slug)}
                className="inline-block px-6 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
                aria-label={`Đọc thêm về quan niệm: ${concept.title}`}
              >
                Xem thêm
              </Link>
            </article>
          </div>
        );
      })}
    </div>
  );
}

