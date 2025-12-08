"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constain";
import ConceptRevealOverlay from "./ConceptRevealOverlay";
import ConceptPortraitLayout from "./ConceptPortraitLayout";
import ConceptLandscapeLayout from "./ConceptLandscapeLayout";
import type { Concept } from "@/types/sanity";

type ConceptDetailContentProps = {
  concept: Concept;
};

const getCategoryDisplay = (category: string): string => {
  const categoryMap: Record<string, string> = {
    inner: "Nội tâm",
    health: "Sức khỏe",
    relationship: "Mối quan hệ",
    finance: "Tài chính",
    knowledge: "Tri thức",
  };
  return categoryMap[category] || category;
};

export default function ConceptDetailContent({ concept }: ConceptDetailContentProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    // Delay hiển thị content để exit animation có thời gian chạy
    setTimeout(() => {
      setShowContent(true);
    }, 800); // Match với duration của exit animation (0.8s)
  };

  const layoutType = concept.layoutType || "portrait";

  return (
    <>
      {/* Reveal Overlay */}
      <ConceptRevealOverlay onReveal={handleReveal} isVisible={!isRevealed} />

      {/* Content - chỉ hiển thị sau khi reveal */}
      {showContent && (
        <div className="container mx-auto px-4 py-8 md:py-14">
          {/* Back button */}
          <Link
            href={ROUTES.CONCEPTS}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            ← Quay lại Kho quan niệm
          </Link>

          {/* Render layout dựa trên layoutType */}
          {layoutType === "portrait" ? (
            <ConceptPortraitLayout concept={concept} getCategoryDisplay={getCategoryDisplay} />
          ) : (
            <ConceptLandscapeLayout concept={concept} getCategoryDisplay={getCategoryDisplay} />
          )}
        </div>
      )}
    </>
  );
}

