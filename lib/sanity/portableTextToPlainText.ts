import type { PortableTextBlock } from "@portabletext/types";

/**
 * Convert PortableTextBlock array to plain text string
 * Dùng cho preview/description trong list views
 */
export function portableTextToPlainText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return "";
      }

      return block.children
        .map((child) => {
          if (typeof child === "string") {
            return child;
          }
          if (typeof child === "object" && child !== null && "text" in child) {
            return String(child.text);
          }
          return "";
        })
        .join("");
    })
    .join("\n\n")
    .trim();
}

