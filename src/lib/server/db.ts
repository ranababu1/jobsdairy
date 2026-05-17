import { drizzle } from "drizzle-orm/d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import * as schema from "../../../drizzle/schema";

export function getDb() {
    let dbBinding: D1Database;
    
    try {
        const ctx = getRequestContext();
        dbBinding = ctx.env.DB;
        
        if (!dbBinding) {
            console.error("DEBUG: getRequestContext().env.DB is undefined. Available env keys:", Object.keys(ctx.env || {}));
        }
    } catch (e) {
        console.error("DEBUG: getRequestContext() threw an error:", e);
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
