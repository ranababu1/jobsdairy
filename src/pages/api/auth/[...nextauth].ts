import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/lib/auth/options";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const forwardedHost = req.headers["x-forwarded-host"];
    const host = Array.isArray(forwardedHost)
        ? forwardedHost[0]
        : forwardedHost || req.headers.host;

    const forwardedProto = req.headers["x-forwarded-proto"];
    const protocol = Array.isArray(forwardedProto)
        ? forwardedProto[0]
        : forwardedProto || (host?.includes("localhost") ? "http" : "https");

    if (process.env.NODE_ENV === "production" && host) {
        process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    }

    return await NextAuth(req, res, authOptions);
}
