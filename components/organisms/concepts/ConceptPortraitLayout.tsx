//đối với ảnh dọc
import Image from "next/image";
import type { Concept } from "@/types/sanity";
import ConceptRichText from "./ConceptRichText";
import { getCategoryDisplay } from "@/lib/constants/categories";

type ConceptPortraitLayoutProps = {
  concept: Concept;
};

export default function ConceptPortraitLayout({
  concept,
}: ConceptPortraitLayoutProps) {
  return (
    <article className="max-w-7xl mx-auto bg-[#F5F1EB] dark:bg-card min-h-screen">
      {/* Header - Full width ở trên */}
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

      {/* Row 2: 3 cột - Image 1 cột, Header 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start px-4 mb-8">
        {/* Image - Portrait (dọc) cột 1 */}
        {concept.image && (
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white/50">
            <Image
              src={concept.image}
              alt={concept.title}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}

        {/* Header - cột 2 và 3 (span 2 cột) */}
        <div className="md:col-span-2 prose prose-lg max-w-none">
          {/* Mở bài - nếu có */}
          {concept.headerContent && concept.headerContent.length > 0 && (
            <div className="concept-header">
              <ConceptRichText content={concept.headerContent} />
            </div>
          )}
        </div>
      </div>

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

