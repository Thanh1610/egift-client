//đối với ảnh ngang
import Image from "next/image";
import type { Concept } from "@/types/sanity";
import ConceptRichText from "./ConceptRichText";
import { getCategoryDisplay } from "@/lib/constants/categories";

type ConceptLandscapeLayoutProps = {
  concept: Concept;
};

export default function ConceptLandscapeLayout({
  concept,
}: ConceptLandscapeLayoutProps) {
  return (
    <article className="max-w-7xl mx-auto bg-[#F5F1EB] dark:bg-card min-h-screen">
      {/* Header */}
      <header className="mb-6 px-4 pt-8">
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {getCategoryDisplay(concept.category)}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-foreground">
          {concept.title}
        </h1>
        {/* Subtitle - nếu có */}
        {concept.subtitle && (
          <p className="text-lg md:text-xl text-foreground/80 italic">
            &quot;{concept.subtitle}&quot;
          </p>
        )}
      </header>

      {/* Separator */}
      <div className="border-t border-foreground/10 mx-4 mb-8" />

      {/* Image - Landscape (ngang) full width */}
      {concept.image && (
        <div className="relative w-full mb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Image
              src={concept.image}
              alt={concept.title}
              width={800}
              height={600}
              className="w-full h-auto object-contain"
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </div>
        </div>
      )}

      {/* Mở bài - nếu có */}
      {concept.headerContent && concept.headerContent.length > 0 && (
        <div className="prose prose-lg max-w-none px-4 mb-8">
          <div className="concept-header">
            <ConceptRichText content={concept.headerContent} />
          </div>
        </div>
      )}

      {/* Row 3: Body và Footer - Full width */}
      <div className="prose prose-lg max-w-none px-4 pb-8">
        {/* Thân bài */}
        {concept.bodyContent && concept.bodyContent.length > 0 && (
          <div className="concept-body mb-8">
            <ConceptRichText content={concept.bodyContent} />
          </div>
        )}
        
        {/* Ứng dụng vào cuộc sống */}
        {concept.applicationContent && concept.applicationContent.length > 0 && (
          <div className="concept-application mt-8">
            <div className="bg-[#F4EBDD] dark:bg-muted/70 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Ứng dụng vào cuộc sống</h2>
              <ConceptRichText content={concept.applicationContent} />
            </div>
          </div>
        )}
        
        {/* Kết bài */}
        {concept.footerContent && concept.footerContent.length > 0 && (
          <div className="concept-footer mt-6">
            <ConceptRichText content={concept.footerContent} />
          </div>
        )}
      </div>
    </article>
  );
}

