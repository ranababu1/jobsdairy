import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { companies } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { companySchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const { id } = await context.params;
        const companyId = Number(id);
        const payload = companySchema.partial().parse(await request.json());

        const tags = payload.tags
            ? payload.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .join(",")
            : undefined;

        const result = await getDb().update(companies).set({
            ...payload,
            ...(tags !== undefined && { tags }),
        }).where(eq(companies.id, companyId)).returning();

        if (result.length === 0) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
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
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const companyId = Number(id);

    const result = await getDb().delete(companies).where(eq(companies.id, companyId)).returning();

    if (result.length === 0) {
        return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
}
