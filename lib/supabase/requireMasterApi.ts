import { NextResponse } from "next/server"
import { type SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { checkRole } from "@/lib/supabase/checkRole"

export type MasterResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; res: NextResponse }

export function apiError(message: string, status = 400, details?: string) {
  const body: Record<string, unknown> = { error: message }
  if (details) body.details = details
  return NextResponse.json(body, { status })
}

export async function requireMasterApi(): Promise<MasterResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, res: apiError("Unauthorized", 401) }
  }

  const roleCheck = await checkRole(supabase, user.id, "master")
  if (!roleCheck.ok) {
    return { ok: false, res: apiError("Forbidden - Master role required", 403) }
  }

  return { ok: true, supabase }
}

