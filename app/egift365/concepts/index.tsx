import ConceptsMobileView from "../../../components/organisms/concepts/ConceptsMobileView";
import ConceptsDesktopView from "../../../components/organisms/concepts/ConceptsDesktopView";
import type { Concept } from "@/types/sanity";

type ConceptsGridProps = {
  concepts: Concept[];
};

export default function ConceptsGrid({ concepts }: ConceptsGridProps) {
  if (!concepts || concepts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Chưa có quan niệm nào được thêm vào.
      </p>
    );
  }

  return (
    <>
      <ConceptsMobileView concepts={concepts} />
      <ConceptsDesktopView concepts={concepts} />
    </>
  );
}

