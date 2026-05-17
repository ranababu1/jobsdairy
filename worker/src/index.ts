import { Hono } from "hono";
import type { D1Database } from "@cloudflare/workers-types";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/api/health", (c) => c.json({ ok: true, service: "jobdairy-worker" }));

app.get("/api/companies", async (c) => {
    const rows = await c.env.DB.prepare("SELECT * FROM companies ORDER BY id DESC").all();
    return c.json(rows.results ?? []);
});

app.post("/api/companies", async (c) => {
    const body = await c.req.json<{
        name: string;
        category?: string;
        location?: string;
        tags?: string;
        notes?: string;
        priority?: string;
    }>();

    await c.env.DB.prepare(
        `INSERT INTO companies (name, category, location, tags, notes, priority) VALUES (?, ?, ?, ?, ?, ?)`,
    )
        .bind(
            body.name,
            body.category ?? null,
            body.location ?? null,
            body.tags ?? null,
            body.notes ?? null,
            body.priority ?? null,
        )
        .run();

    return c.json({ ok: true }, 201);
});

app.get("/api/jobs", async (c) => {
    const rows = await c.env.DB.prepare("SELECT * FROM jobs ORDER BY id DESC").all();
    return c.json(rows.results ?? []);
});

app.get("/api/applications", async (c) => {
    const rows = await c.env.DB.prepare("SELECT * FROM applications ORDER BY id DESC").all();
    return c.json(rows.results ?? []);
});

app.get("/api/resumes", async (c) => {
    const rows = await c.env.DB.prepare("SELECT * FROM resumes ORDER BY id DESC").all();
    return c.json(rows.results ?? []);
});

export default app;
