import { PortableText } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/lib/sanity/image";

type ConceptRichTextProps = {
  content: PortableTextBlock[];
  className?: string;
};

/**
 * Component để render rich text từ Sanity blockContent
 * Hỗ trợ đầy đủ: headings (H1-H6), lists, images, formatting (bold, italic, underline, code, strike), links
 */
export default function ConceptRichText({ content, className = "" }: ConceptRichTextProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableText
        value={content}
        components={{
          block: {
            normal: ({ children }) => (
              <p className="text-base md:text-lg leading-relaxed text-foreground mb-4">
                {children}
              </p>
            ),
            h1: ({ children }) => (
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl md:text-2xl font-semibold mb-2 leading-tight">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg md:text-xl font-semibold mb-2 leading-tight">{children}</h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-base md:text-lg font-semibold mb-2 leading-tight">{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-sm md:text-base font-semibold mb-2 leading-tight">{children}</h6>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
            ),
          },
          listItem: {
            bullet: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
            number: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
          },
          marks: {
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            underline: ({ children }) => <u className="underline">{children}</u>,
            code: ({ children }) => (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
            ),
            "strike-through": ({ children }) => (
              <span className="line-through">{children}</span>
            ),
            link: ({ children, value }) => {
              const href = value?.href || "#";
              const blank = value?.blank || false;
              return (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target={blank ? "_blank" : undefined}
                  rel={blank ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
          },
          types: {
            image: ({ value }) => {
              if (!value?.asset) {
                return null;
              }
              
              // Build image URL using Sanity image URL builder
              const imageUrl = urlFor(value.asset).url();
              const alt = value.alt || "";
              const caption = value.caption;

              if (!imageUrl) {
                return null;
              }

              return (
                <figure className="my-6 max-w-md mx-auto">
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={alt}
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                      sizes="(min-width: 1024px) 512px, (min-width: 768px) 384px, 100vw"
                    />
                  </div>
                  {caption && (
                    <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            },
          },
        }}
      />
    </div>
  );
}

