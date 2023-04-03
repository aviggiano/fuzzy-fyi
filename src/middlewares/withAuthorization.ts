import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { MiddlewareFactory } from "./types";

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    const response = NextResponse.next();

    switch (true) {
      case pathname.startsWith("/dashboard"): {
        const supabase = createMiddlewareSupabaseClient({
          req: request,
          res: response,
        });
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user.email) {
          next(request, _next);
        } else {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/";
          redirectUrl.searchParams.set(
            `redirectedFrom`,
            request.nextUrl.pathname
          );
          return NextResponse.redirect(redirectUrl);
        }
      }
      default: {
        next(request, _next);
      }
    }
  };
};
