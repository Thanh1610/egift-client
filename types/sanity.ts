/**
 * Types cho Sanity CMS
 */
import type { PortableTextBlock } from "@portabletext/types";

// Sanity Image Asset
export type SanityImageAsset = {
  _id: string;
  url: string;
};

// Sanity Image Reference
export type SanityImageReference = {
  asset: SanityImageAsset;
};

// Concept từ Sanity (raw response)
export type SanityConcept = {
  _id: string;
  title: string;
  subtitle?: string;
  headerContent?: PortableTextBlock[];
  bodyContent?: PortableTextBlock[];
  footerContent?: PortableTextBlock[];
  applicationContent?: PortableTextBlock[];
  description?: PortableTextBlock[]; // Legacy field for backward compatibility
  image: SanityImageReference | null;
  backgroundImage?: SanityImageReference | null;
  audio?: { asset: SanityImageAsset } | null;
  slug: string;
  category: string;
  order: number;
  isActive: boolean;
  layoutType?: "portrait" | "landscape";
};

// Concept đã transform (cho component)
export type Concept = {
  id: string;
  title: string;
  subtitle?: string;
  headerContent?: PortableTextBlock[];
  bodyContent: PortableTextBlock[];
  footerContent?: PortableTextBlock[];
  applicationContent?: PortableTextBlock[];
  image: string;
  backgroundImage?: string;
  audio?: string | null;
  slug: string;
  category: string;
  order: number;
  isActive: boolean;
  layoutType?: "portrait" | "landscape";
  href: string;
  // Legacy: description = bodyContent (for backward compatibility)
  description: PortableTextBlock[];
};

// Inner Story từ Sanity (raw response)
// Note: reads, likes, bookmarks đã được chuyển sang Supabase, không còn fetch từ Sanity
export type SanityInnerStory = {
  _id: string;
  title: string;
  category: string;
  image: SanityImageReference | null;
  description: PortableTextBlock[]; // Rich text editor (blockContent)
  listenTime: string;
  slug: string;
  order: number;
  isActive: boolean;
};

// Inner Story đã transform (cho component)
export type InnerStory = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: PortableTextBlock[]; // Rich text editor (blockContent)
  listenTime: string;
  likes: number;
  bookmarks: number;
  reads: number;
  slug: string;
  order: number;
  isActive: boolean;
  href: string;
};

