import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

/**
 * User Profile từ database (profiles table)
 */
export interface UserProfile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  role?: string
  created_at?: string
  updated_at?: string
}

interface UserState {
  // Auth user từ Supabase
  user: User | null
  // Profile từ database
  profile: UserProfile | null
  // Loading state
  isLoading: boolean
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (isLoading: boolean) => void
  // Clear all data (khi logout)
  clearUser: () => void
}

/**
 * Zustand store để quản lý user state
 * Không dùng persist để tránh vấn đề với SSR
 * User data sẽ được sync từ Supabase session
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, profile: null, isLoading: false }),
}))

