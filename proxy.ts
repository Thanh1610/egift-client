import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';
import { createServerClient } from '@supabase/ssr';
import { ROUTES } from '@/lib/constants/routes';
import { isPublicAccessAllowed } from '@/lib/supabase/publicAccessToken';

/**
 * Tạo Supabase client với cookie handling
 */
type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
};

function createSupabaseClient(
  request: NextRequest,
  response: NextResponse,
  onSetCookie?: (
    cookiesToSet: Array<{
      name: string;
      value: string;
      options?: CookieOptions;
    }>
  ) => void
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: cookiesToSet => {
          if (onSetCookie) {
            const transformedCookies = cookiesToSet.map(
              ({ name, value, options }) => ({
              name,
              value,
                options: options
                  ? ({
                ...options,
                      sameSite:
                        typeof options.sameSite === 'boolean'
                          ? options.sameSite
                            ? 'lax'
                            : 'none'
                  : options.sameSite,
                    } as CookieOptions)
                  : undefined,
              })
            );
            onSetCookie(transformedCookies);
          } else {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              const transformedOptions = options
                ? {
                ...options,
                    sameSite:
                      typeof options.sameSite === 'boolean'
                        ? options.sameSite
                          ? 'lax'
                          : 'none'
                  : options.sameSite,
                  }
                : undefined;
              response.cookies.set(name, value, transformedOptions);
            });
          }
        },
      },
    }
  );
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
async function checkAuthentication(request: NextRequest): Promise<boolean> {
  const supabase = createSupabaseClient(
    request,
    NextResponse.next({ request }),
    () => {} // Read-only
  );
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return !!user && !error;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth callback - luôn cho phép (cần xử lý OAuth)
  if (
    pathname === ROUTES.AUTH.CALLBACK ||
    pathname.startsWith(ROUTES.AUTH.CALLBACK + '/')
  ) {
    return await updateSession(request);
  }

  // Auth routes (login, signup) - nếu đã đăng nhập thì logout trước
  const isAuthRoute =
    pathname === ROUTES.AUTH.LOGIN || pathname === ROUTES.AUTH.SIGNUP;
  
  if (isAuthRoute) {
    const response = await updateSession(request);
    const isAuthenticated = await checkAuthentication(request);

    if (isAuthenticated) {
      // Logout nếu đã đăng nhập
      const logoutResponse = NextResponse.next({ request });
      const logoutClient = createSupabaseClient(
        request,
        logoutResponse,
        cookiesToSet => {
        cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            logoutResponse.cookies.set(name, value, options);
          });
        }
      );
      
      await logoutClient.auth.signOut();
      return logoutResponse;
    }

    return response;
  }

  // Routes /egift365 và các route con - yêu cầu đăng nhập
  const isEgift365Route =
    pathname === ROUTES.HOME || pathname.startsWith(ROUTES.HOME + '/');
  
  if (isEgift365Route) {
    const response = await updateSession(request);

    // Kiểm tra nếu là route concepts/[slug] (detail page, không phải list page)
    // Ví dụ: /egift365/concepts/my-slug (có slug sau /concepts/)
    const conceptsBase = `${ROUTES.HOME}/concepts`;
    const isConceptsDetailRoute =
      pathname.startsWith(`${conceptsBase}/`) && pathname !== conceptsBase;

    // Nếu là concepts detail route và có code, kiểm tra public access token
    if (isConceptsDetailRoute) {
      const hasPublicAccess = await isPublicAccessAllowed(request, pathname);
      if (hasPublicAccess) {
        // Cho phép truy cập công khai với code hợp lệ
        return response;
      }
    }

    // Nếu không có public access, kiểm tra authentication như bình thường
    const supabase = createSupabaseClient(request, response);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Các route khác (không phải auth, không phải egift365) - cho phép truy cập
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
