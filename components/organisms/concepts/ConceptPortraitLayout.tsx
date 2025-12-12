//đối với ảnh dọc
import Image from 'next/image';
import type { Concept } from '@/types/sanity';
import ConceptRichText from './ConceptRichText';
import { getCategoryDisplay } from '@/lib/constants/categories';
import AudioPlayer from '@/components/molecules/ui/AudioPlayer';
import ShareSocial from '@/components/molecules/ui/ShareSocial';

type ConceptPortraitLayoutProps = {
  concept: Concept;
};

export default function ConceptPortraitLayout({
  concept,
}: ConceptPortraitLayoutProps) {
  return (
    <article className="border-foreground/10 dark:bg-card/60 mx-auto min-h-screen max-w-7xl rounded-3xl border bg-[#FDF8F0]/85 shadow-lg">
      {/* Header - Full width ở trên */}
      <header className="mb-6 px-4 pt-8">
        <div className="mb-4">
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            {getCategoryDisplay(concept.category)}
          </span>
        </div>
        <h1 className="text-foreground mb-4 text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
          {concept.title}
        </h1>
        {/* Subtitle - nếu có */}
        {concept.subtitle && (
          <p className="text-foreground/80 text-lg italic md:text-xl">
            &quot;{concept.subtitle}&quot;
          </p>
        )}
        {/* Audio - nếu có */}
        {concept.audio && (
          <AudioPlayer src={concept.audio} title="Nghe Tri thức" />
        )}
        <ShareSocial
          url={concept.slug}
          title={concept.title}
          className="mt-4"
        />
      </header>

      {/* Separator */}
      <div className="border-foreground/10 mx-4 mb-8 border-t" />

      {/* Row 2: 3 cột - Image 1 cột, Header 2 cột */}
      <div className="mb-8 grid grid-cols-1 items-start gap-8 px-4 md:grid-cols-3 lg:gap-12">
        {/* Image - Portrait (dọc) cột 1 */}
        {concept.image && (
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-white/50">
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
        <div className="prose prose-lg max-w-none md:col-span-2">
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
        {concept.applicationContent &&
          concept.applicationContent.length > 0 && (
            <div className="concept-application mt-8">
              <div className="dark:bg-muted/70 rounded-lg bg-[#F4EBDD] p-6">
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  Ứng dụng vào cuộc sống
                </h2>
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
