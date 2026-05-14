import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    const { id } = await context.params;
    const resumeId = Number(id);
    const index = db.resumes.findIndex((resume) => resume.id === resumeId);

    if (index === -1) {
        return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const [deleted] = db.resumes.splice(index, 1);
    return NextResponse.json(deleted);
}
