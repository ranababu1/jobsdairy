import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { companySchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET() {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    return NextResponse.json(db.companies);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const payload = companySchema.parse(await request.json());
        const company = db.createCompany({
            name: payload.name,
            careersUrl: payload.careersUrl || undefined,
            linkedinUrl: payload.linkedinUrl || undefined,
            location: payload.location || undefined,
            category: payload.category || undefined,
            tags: payload.tags
                ? payload.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [],
            notes: payload.notes || undefined,
            priority: payload.priority,
            archived: payload.archived,
        });
        return NextResponse.json(company, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
