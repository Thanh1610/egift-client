"use client";

import { useState } from "react";
import ConceptRevealOverlay from "./ConceptRevealOverlay";
import ConceptPortraitLayout from "./ConceptPortraitLayout";
import ConceptLandscapeLayout from "./ConceptLandscapeLayout";
import type { Concept } from "@/types/sanity";

type ConceptDetailContentProps = {
  concept: Concept;
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
          {/* Render layout dựa trên layoutType */}
          {layoutType === "portrait" ? (
            <ConceptPortraitLayout concept={concept} />
          ) : (
            <ConceptLandscapeLayout concept={concept} />
          )}
        </div>
      )}
    </>
  );
}

