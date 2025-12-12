import { NextRequest, NextResponse } from "next/server";
import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import { checkRole } from "@/lib/supabase/checkRole";

/**
 * Helper trả JSON error
 */
function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

type RequireMasterResult =
  | { ok: true; supabase: SupabaseClient }
  | { ok: false; res: NextResponse };

/**
 * Helper: kiểm tra user + role master
 */
async function requireMaster(): Promise<RequireMasterResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, res: error("Unauthorized", 401) };
  }

  const roleCheck = await checkRole(supabase, user.id, "master");
  if (!roleCheck.ok) {
    return { ok: false, res: error("Forbidden - Master role required", 403) };
  }

  return { ok: true, supabase };
}

/**
 * GET /api/public-tokens
 */
export async function GET() {
  try {
    const auth = await requireMaster();
    if (!auth.ok) return auth.res;

    const supabase = auth.supabase;

    const { data, error: fetchError } = await supabase
      .from("public_access_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      return error("Failed to fetch tokens", 500);
    }

    return NextResponse.json({ tokens: data ?? [] });
  } catch (err) {
    console.error("GET /api/public-tokens error:", err);
    return error("Internal server error", 500);
  }
}

/**
 * POST /api/public-tokens
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireMaster();
    if (!auth.ok) return auth.res;

    const supabase = auth.supabase;

    const { path, code } = await request.json();

    if (!path || typeof path !== "string" || !path.trim()) {
      return error("Path is required and must be a non-empty string");
    }

    const finalCode =
      code?.trim() ||
      randomBytes(16).toString("hex"); // 32 chars

    // Check code trùng
    const { data: exists } = await supabase
      .from("public_access_tokens")
      .select("code")
      .eq("code", finalCode)
      .maybeSingle();

    if (exists) {
      return error("Code already exists");
    }

    // Insert
    const { data, error: insertError } = await supabase
      .from("public_access_tokens")
      .insert({
        code: finalCode,
        path: path.trim(),
      })
      .select()
      .single();

    if (insertError) {
      return error("Failed to create token", 500);
    }

    return NextResponse.json({ token: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/public-tokens error:", err);
    return error("Internal server error", 500);
  }
}
