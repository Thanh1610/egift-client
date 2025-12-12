import { type SupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

/**
 * Kiểm tra role của user. Mặc định yêu cầu master.
 * Trả về { ok: boolean, response?: NextResponse } để tái sử dụng trong route handlers.
 */
export async function checkRole(
  supabase: SupabaseClient,
  userId: string,
  requiredRole: string = "master"
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (error || profile?.role !== requiredRole) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden - Master role required" },
        { status: 403 }
      ),
    }
  }

  return { ok: true }
}

