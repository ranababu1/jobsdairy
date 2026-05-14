import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const isProd = process.env.NODE_ENV === "production";

const githubClientId = process.env.AUTH_GITHUB_ID || "";
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || "";
const nextAuthSecret =
    process.env.NEXTAUTH_SECRET || (!isProd ? "dev-only-secret-change-me" : undefined);

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
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: nextAuthSecret,
};
