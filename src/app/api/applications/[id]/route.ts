import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { applications } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { applicationSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await context.params;
        const applicationId = Number(id);
        const payload = applicationSchema.partial().parse(await request.json());

        const result = await getDb().update(applications).set(payload).where(eq(applications.id, applicationId)).returning();

        if (result.length === 0) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
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
    const applicationId = Number(id);

    const result = await getDb().delete(applications).where(eq(applications.id, applicationId)).returning();

    if (result.length === 0) {
        return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
}
