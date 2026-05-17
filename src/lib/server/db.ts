import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "../../../drizzle/schema";

export function getDb() {
    let dbBinding: D1Database | undefined;

    try {
        const ctx = getCloudflareContext();
        dbBinding = (ctx.env as { DB?: D1Database }).DB as D1Database;

        if (!dbBinding) {
            console.error("DEBUG: getCloudflareContext().env.DB is undefined. Available env keys:", Object.keys(ctx.env || {}));
        }
    } catch (e) {
        console.error("DEBUG: getCloudflareContext() threw an error:", e);
    }

    if (!dbBinding) {
        if (process.env.DB) {
            dbBinding = process.env.DB as unknown as D1Database;
        } else {
            console.error("DEBUG: Fallback process.env.DB is also undefined.");
            throw new Error("D1 Database binding not found.");
        }
    }

    return drizzle(dbBinding, { schema });
}
