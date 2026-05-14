import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { applicationSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET() {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    return NextResponse.json(db.applications);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const payload = applicationSchema.parse(await request.json());
        const application = db.createApplication({
            ...payload,
            recruiterEmail: payload.recruiterEmail || undefined,
        });

        const job = db.jobs.find((item) => item.id === payload.jobId);
        if (job) {
            job.status = payload.currentStage as typeof job.status;
        }

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
