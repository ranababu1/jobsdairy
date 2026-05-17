import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { companies } from "../../../../drizzle/schema";
import { companySchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET(request: NextRequest) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;

    const data = await getDb().select().from(companies);
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    try {
        const payload = companySchema.parse(await request.json());
        const result = await getDb().insert(companies).values({
            name: payload.name,
            careersUrl: payload.careersUrl || null,
            linkedinUrl: payload.linkedinUrl || null,
            location: payload.location || null,
            category: payload.category || null,
            tags: payload.tags
                ? payload.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .join(",")
                : null,
            notes: payload.notes || null,
            priority: payload.priority,
        }).returning();

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
