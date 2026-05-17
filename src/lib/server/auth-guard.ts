import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const secret =
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me" : undefined);

export async function requireApiSession(request: NextRequest) {
    const token = await getToken({ req: request, secret });

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return null;
}
