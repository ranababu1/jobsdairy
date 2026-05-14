import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown) {
    if (error instanceof ZodError) {
        return NextResponse.json(
            { message: "Validation failed", issues: error.issues },
            { status: 400 },
        );
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ message }, { status: 500 });
}
