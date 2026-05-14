import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { requireApiSession } from "@/lib/server/auth-guard";
import { db } from "@/lib/server/store";

export async function GET() {
    const unauthorized = await requireApiSession();
    if (unauthorized) return unauthorized;
    const metrics = db.metrics();

    const applicationsByMonth = db.applications.reduce<Record<string, number>>(
        (acc, application) => {
            const key = dayjs(application.appliedDate).format("MMM YYYY");
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const statusDistribution = db.applications.reduce<Record<string, number>>(
        (acc, application) => {
            const key = application.currentStage;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const companyCategoryDistribution = db.companies.reduce<Record<string, number>>(
        (acc, company) => {
            const key = company.category || "Uncategorized";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const resumePerformance = db.resumes.map((resume) => {
        const relatedApplications = db.applications.filter(
            (application) => application.resumeId === resume.id,
        );
        return {
            resumeVersion: resume.versionName,
            applied: relatedApplications.length,
            interviews: relatedApplications.filter((item) =>
                ["Interview", "Final Round"].includes(item.currentStage),
            ).length,
            offers: relatedApplications.filter((item) => item.currentStage === "Offer")
                .length,
        };
    });

    return NextResponse.json({
        metrics,
        charts: {
            applicationsByMonth: Object.entries(applicationsByMonth).map(([month, value]) => ({
                month,
                value,
            })),
            statusDistribution: Object.entries(statusDistribution).map(([name, value]) => ({
                name,
                value,
            })),
            companyCategoryDistribution: Object.entries(companyCategoryDistribution).map(
                ([name, value]) => ({
                    name,
                    value,
                }),
            ),
            resumePerformance,
        },
    });
}
