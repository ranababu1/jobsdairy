import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { resumes } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const resumeId = Number(id);

    const result = await getDb().delete(resumes).where(eq(resumes.id, resumeId)).returning();

    if (result.length === 0) {
        return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
}
