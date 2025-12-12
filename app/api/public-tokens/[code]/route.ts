import { NextRequest, NextResponse } from "next/server";
import { requireMasterApi, apiError } from "@/lib/supabase/requireMasterApi";

/**
 * DELETE /api/public-tokens/[code]
 * Xóa token
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const master = await requireMasterApi();
    if (!master.ok) return master.res;
    const supabase = master.supabase;

    // Xóa token
    const { error } = await supabase
      .from("public_access_tokens")
      .delete()
      .eq("code", code);

    if (error) {
      return apiError("Failed to delete token", 500, error.message);
    }

    return NextResponse.json({ success: true });
  } catch {
    return apiError("Internal server error", 500);
  }
}

/**
 * PUT /api/public-tokens/[code]
 * Cập nhật token (path hoặc code)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const master = await requireMasterApi();
    if (!master.ok) return master.res;
    const supabase = master.supabase;

    const body = await request.json();
    const { path, newCode } = body;

    // Validate
    if (!path || typeof path !== "string" || path.trim() === "") {
      return apiError("Path is required and must be a non-empty string", 400);
    }

    // Nếu có newCode, kiểm tra code mới đã tồn tại chưa (nếu khác code hiện tại)
    if (newCode && newCode !== code) {
      const { data: existing } = await supabase
        .from("public_access_tokens")
        .select("code")
        .eq("code", newCode)
        .maybeSingle();

      if (existing) {
        return apiError("New code already exists", 400);
      }
    }

    // Nếu đổi code: xóa record cũ, chèn record mới
    if (newCode && newCode !== code) {
      const deleteResult = await supabase
        .from("public_access_tokens")
        .delete()
        .eq("code", code);

      if (deleteResult.error) {
        return apiError("Failed to update token", 500, deleteResult.error.message);
      }

      const insertResult = await supabase
        .from("public_access_tokens")
        .insert({
          code: newCode,
          path: path.trim(),
        })
        .select()
        .single();

      if (insertResult.error) {
        return apiError("Failed to update token code", 500, insertResult.error.message);
      }

      return NextResponse.json({ token: insertResult.data });
    }

    // Không đổi code: chỉ update path
    const updateResult = await supabase
      .from("public_access_tokens")
      .update({ path: path.trim() })
      .eq("code", code)
      .select()
      .single();

    if (updateResult.error) {
      return apiError("Failed to update token", 500, updateResult.error.message);
    }

    return NextResponse.json({ token: updateResult.data });
  } catch {
    return apiError("Internal server error", 500);
  }
}

