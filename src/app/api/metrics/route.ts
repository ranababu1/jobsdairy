import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { requireApiSession } from "@/lib/server/auth-guard";
import { getDb } from "@/lib/server/db";
import { applications, companies, jobs, resumes } from "../../../../drizzle/schema";

export async function GET(request: NextRequest) {
    const unauthorized = await requireApiSession(request);
    if (unauthorized) return unauthorized;

    const db = getDb();
    const allCompanies = await db.select().from(companies);
    const allJobs = await db.select().from(jobs);
    const allApplications = await db.select().from(applications);
    const allResumes = await db.select().from(resumes);

    // Calculate metrics
    const totalCompanies = allCompanies.length;
    const totalJobs = allJobs.length;
    const totalApplications = allApplications.length;
    const monthKey = dayjs().format("YYYY-MM");
    const applicationsThisMonth = allApplications.filter((item) =>
        item.appliedDate?.startsWith(monthKey),
    ).length;

    const interviewsScheduled = allApplications.filter((item) =>
        ["Interview", "Final Round"].includes(item.currentStage || ""),
    ).length;
    const offersReceived = allApplications.filter(
        (item) => item.currentStage === "Offer",
    ).length;
    const rejectionCount = allApplications.filter(
        (item) => item.currentStage === "Rejected",
    ).length;
    const responded = allApplications.filter(
        (item) => !["Applied", "Wishlist", "Saved"].includes(item.currentStage || ""),
    ).length;

    const metrics = {
        totalCompanies,
        totalJobs,
        totalApplications,
        applicationsThisMonth,
        interviewsScheduled,
        offersReceived,
        rejectionCount,
        responseRate: totalApplications ? Math.round((responded / totalApplications) * 100) : 0,
        interviewConversionRate: totalApplications
            ? Math.round((interviewsScheduled / totalApplications) * 100)
            : 0,
    };

    const applicationsByMonth = allApplications.reduce<Record<string, number>>(
        (acc, application) => {
            if (!application.appliedDate) return acc;
            const key = dayjs(application.appliedDate).format("MMM YYYY");
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const statusDistribution = allApplications.reduce<Record<string, number>>(
        (acc, application) => {
            const key = application.currentStage || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const companyCategoryDistribution = allCompanies.reduce<Record<string, number>>(
        (acc, company) => {
            const key = company.category || "Uncategorized";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        },
        {},
    );

    const resumePerformance = allResumes.map((resume) => {
        const relatedApplications = allApplications.filter(
            (application) => application.resumeId === resume.id,
        );
        return {
            resumeVersion: resume.versionName,
            applied: relatedApplications.length,
            interviews: relatedApplications.filter((item) =>
                ["Interview", "Final Round"].includes(item.currentStage || ""),
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
