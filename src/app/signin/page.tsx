"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [router, status]);

    return (
        <main className="grid min-h-screen place-items-center bg-base-200 p-6">
            <section className="card w-full max-w-md border border-base-300 bg-base-100 shadow-2xl">
                <div className="card-body">
                    <h1 className="text-2xl font-semibold">Sign in to JobDairy</h1>
                    <p className="text-sm text-base-content/70">
                        Use GitHub OAuth to access your private career dashboard.
                    </p>
                    <div className="alert alert-info text-sm">
                        Configure GitHub OAuth env vars in .env.local before first login.
                    </div>
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        type="button"
                    >
                        Continue with GitHub
                    </button>
                </div>
            </section>
        </main>
    );
}
