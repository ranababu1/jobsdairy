import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { jobSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const { id } = await context.params;
        const jobId = Number(id);
        const payload = jobSchema.partial().parse(await request.json());
        const index = db.jobs.findIndex((job) => job.id === jobId);

        if (index === -1) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        db.jobs[index] = {
            ...db.jobs[index],
            ...payload,
        };

        return NextResponse.json(db.jobs[index]);
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
    const jobId = Number(id);
    const index = db.jobs.findIndex((job) => job.id === jobId);

    if (index === -1) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const [deleted] = db.jobs.splice(index, 1);
    return NextResponse.json(deleted);
}
