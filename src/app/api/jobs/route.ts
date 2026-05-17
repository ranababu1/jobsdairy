import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { jobs } from "../../../../drizzle/schema";
import { jobSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET(request: NextRequest) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    const data = await getDb().select().from(jobs);
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;
    try {
        const payload = jobSchema.parse(await request.json());
        const result = await getDb().insert(jobs).values({
            ...payload,
            jobUrl: payload.jobUrl || null,
        }).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
