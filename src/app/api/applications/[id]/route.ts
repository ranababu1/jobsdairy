import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { applicationSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const { id } = await context.params;
        const applicationId = Number(id);
        const payload = applicationSchema.partial().parse(await request.json());
        const index = db.applications.findIndex(
            (application) => application.id === applicationId,
        );

        if (index === -1) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }

        db.applications[index] = {
            ...db.applications[index],
            ...payload,
        };

        return NextResponse.json(db.applications[index]);
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
    const applicationId = Number(id);
    const index = db.applications.findIndex(
        (application) => application.id === applicationId,
    );

    if (index === -1) {
        return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    const [deleted] = db.applications.splice(index, 1);
    return NextResponse.json(deleted);
}
