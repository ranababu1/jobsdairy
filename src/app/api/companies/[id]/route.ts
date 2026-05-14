import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
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
        const index = db.companies.findIndex((company) => company.id === companyId);

        if (index === -1) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        const current = db.companies[index];
        db.companies[index] = {
            ...current,
            ...payload,
            tags: payload.tags
                ? payload.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : current.tags,
        };

        return NextResponse.json(db.companies[index]);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const companyId = Number(id);
    const index = db.companies.findIndex((company) => company.id === companyId);

    if (index === -1) {
        return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const [deleted] = db.companies.splice(index, 1);
    return NextResponse.json(deleted);
}
