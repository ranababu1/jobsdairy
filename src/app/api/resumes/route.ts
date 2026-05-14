import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";
import { resumeSchema } from "@/lib/validators/schemas";
import { handleError } from "@/lib/server/http";

export async function GET() {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    return NextResponse.json(db.resumes);
}

export async function POST(request: NextRequest) {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    try {
        const payload = resumeSchema.parse(await request.json());
        const resume = db.createResume({
            ...payload,
            fileUrl: payload.fileUrl || "",
            tags: payload.tags
                ? payload.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [],
        });

        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
