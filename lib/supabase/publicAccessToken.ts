import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: "strict" | "lax" | "none"
  secure?: boolean
}

function matchPath(actualPath: string, patternPath: string): boolean {
  if (actualPath === patternPath) return true

  if (patternPath.includes("[") && patternPath.includes("]")) {
    const pattern = patternPath
      .replace(/\[slug\]/g, "[^/]+")
      .replace(/\[.*?\]/g, "[^/]+")

    const regex = new RegExp(`^${pattern.replace(/\//g, "\\/")}$`)
    return regex.test(actualPath)
  }

  if (patternPath.endsWith("*")) {
    const prefix = patternPath.slice(0, -1)
    return actualPath.startsWith(prefix)
  }

  return false
}

function createSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            const transformedOptions = options
              ? {
                  ...options,
                  sameSite:
                    typeof options.sameSite === "boolean"
                      ? (options.sameSite ? "lax" : "none")
                      : options.sameSite,
                }
              : undefined

            request.cookies.set(name, value)
            response.cookies.set(name, value, transformedOptions as CookieOptions)
          })
        },
      },
    }
  )
}

export async function isPublicAccessAllowed(
  request: NextRequest,
  pathname: string
): Promise<boolean> {
  const code = request.nextUrl.searchParams.get("code")
  if (!code) return false

  const supabaseResponse = NextResponse.next({ request })
  const supabase = createSupabaseClient(request, supabaseResponse)

  const { data, error } = await supabase
    .from("public_access_tokens")
    .select("path")
    .eq("code", code)
    .single()

  if (error || !data) return false

  return matchPath(pathname, data.path)
}

