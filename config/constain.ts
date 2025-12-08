export const ROUTES = {
  HOME: '/egift365',
  CONCEPTS: '/egift365/concepts',
  STORIES: '/egift365/stories',
  PROFILE: '/egift365/profile',
} as const;

/**
 * Helper function to build detail URL from base route and slug
 */
export function getDetailUrl(baseRoute: string, slug: string): string {
  return `${baseRoute}/${slug}`;
}
