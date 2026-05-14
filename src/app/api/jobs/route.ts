import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { jobSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET() {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    return NextResponse.json(db.jobs);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const payload = jobSchema.parse(await request.json());
        const job = db.createJob({
            ...payload,
            jobUrl: payload.jobUrl || undefined,
            recruiterEmail: payload.recruiterEmail || undefined,
        });
        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
