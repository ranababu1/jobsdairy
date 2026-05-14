import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const secret =
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me" : undefined);

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret });

    if (!token) {
        const signInUrl = new URL("/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/companies/:path*",
        "/jobs/:path*",
        "/applications/:path*",
        "/resumes/:path*",
        "/analytics/:path*",
        "/kanban/:path*",
        "/settings/:path*",
    ],
};
