import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const isProd = process.env.NODE_ENV === "production";

const githubClientId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID || "";
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET || "";
const nextAuthSecret =
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    (!isProd ? "dev-only-secret-change-me" : undefined);

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Only allow same-origin or relative callback URLs to avoid localhost or external bounce issues.
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            try {
                const target = new URL(url);
                if (target.origin === baseUrl) return url;
            } catch {
                // Fall back to base URL when callback URL parsing fails.
            }

            return baseUrl;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    logger: {
        error(code, metadata) {
            console.error("NextAuth error:", code, metadata);
        },
    },
    secret: nextAuthSecret,
};
