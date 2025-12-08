import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type StoryStats = {
  likes: number;
  reads: number;
  isLiked: boolean;
  isBookmarked: boolean;
};

/**
 * Fetch story stats from API
 */
async function fetchStoryStats(slug: string): Promise<StoryStats> {
  const res = await fetch(`/api/stories/${slug}/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch story stats");
  }
  return res.json();
}

/**
 * Like/unlike a story
 */
async function toggleLike(slug: string): Promise<StoryStats> {
  const res = await fetch(`/api/stories/${slug}/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "like" }),
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to like story");
  }

  return res.json();
}

/**
 * Toggle bookmark for a story
 */
async function toggleBookmark(slug: string): Promise<StoryStats> {
  const res = await fetch(`/api/stories/${slug}/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "bookmark" }),
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to bookmark story");
  }

  return res.json();
}

/**
 * Increment read count (auto-called when page loads)
 */
async function incrementRead(slug: string): Promise<StoryStats> {
  const res = await fetch(`/api/stories/${slug}/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "read" }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to increment read");
  }

  return res.json();
}

/**
 * Hook to fetch and manage story stats
 */
export function useStoryStats(slug: string) {
  return useQuery({
    queryKey: ["storyStats", slug],
    queryFn: () => fetchStoryStats(slug),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to like/unlike a story
 */
export function useToggleLike(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => toggleLike(slug),
    onSuccess: (data) => {
      // Update the query cache with new data
      queryClient.setQueryData(["storyStats", slug], data);
      // Invalidate to refetch if needed
      queryClient.invalidateQueries({ queryKey: ["storyStats", slug] });
    },
    onError: (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        router.push("/auth/login");
      }
    },
  });
}

/**
 * Hook to toggle bookmark for a story
 */
export function useToggleBookmark(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => toggleBookmark(slug),
    onSuccess: (data) => {
      // Update the query cache with new data
      queryClient.setQueryData(["storyStats", slug], data);
      // Invalidate to refetch if needed
      queryClient.invalidateQueries({ queryKey: ["storyStats", slug] });
    },
    onError: (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        router.push("/auth/login");
      }
    },
  });
}

/**
 * Hook to increment read count (auto-called on page load)
 */
export function useIncrementRead(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => incrementRead(slug),
    onSuccess: (data) => {
      // Update the query cache with new data
      queryClient.setQueryData(["storyStats", slug], data);
    },
    // Don't show error to user for read increment
    onError: () => {
      // Silently fail
    },
  });
}
