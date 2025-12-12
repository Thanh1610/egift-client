import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { ROUTES, getLoginUrlWithError } from "@/lib/constants/routes"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? ROUTES.HOME

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(new URL(getLoginUrlWithError(exchangeError.message), requestUrl.origin))
    }

    // For client app, we don't check role - any authenticated user can access
    // If profile doesn't exist, create one automatically
    if (sessionData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.user.id)
        .single()

      if (profileError || !profile) {
        // If profile doesn't exist, create one with default role "member"
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert({
            id: sessionData.user.id,
            email: sessionData.user.email || "",
            full_name: sessionData.user.user_metadata?.full_name || sessionData.user.user_metadata?.name || null,
            role: "member",
            avatar_url: sessionData.user.user_metadata?.avatar_url || null,
          }, { onConflict: "id" })

        if (insertError) {
          console.error("Error creating profile:", insertError)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

