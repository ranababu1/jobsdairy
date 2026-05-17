import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { jobs } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { jobSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await context.params;
        const jobId = Number(id);
        const payload = jobSchema.partial().parse(await request.json());

        const result = await getDb().update(jobs).set(payload).where(eq(jobs.id, jobId)).returning();

        if (result.length === 0) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const jobId = Number(id);

    const result = await getDb().delete(jobs).where(eq(jobs.id, jobId)).returning();

    if (result.length === 0) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
}
