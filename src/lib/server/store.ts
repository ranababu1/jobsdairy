import dayjs from "dayjs";
import type {
    Application,
    Company,
    DashboardMetrics,
    Job,
    Resume,
} from "@/types/models";

type DbState = {
    companies: Company[];
    jobs: Job[];
    applications: Application[];
    resumes: Resume[];
    counters: {
        companies: number;
        jobs: number;
        applications: number;
        resumes: number;
    };
};

const seeded: DbState = {
    companies: [
        {
            id: 1,
            name: "Acme AI",
            category: "AI",
            location: "Remote",
            tags: ["high-growth", "ml-platform"],
            priority: "high",
            notes: "Strong engineering culture and open-source focus.",
            createdAt: dayjs().subtract(20, "day").toISOString(),
        },
    ],
    jobs: [
        {
            id: 1,
            companyId: 1,
            title: "Senior Full Stack Engineer",
            location: "Remote",
            salaryRange: "$140k - $180k",
            source: "Company Careers",
            status: "Applied",
            createdAt: dayjs().subtract(10, "day").toISOString(),
            notes: "Expect system design interview.",
        },
    ],
    resumes: [
        {
            id: 1,
            versionName: "General SWE v2",
            focusArea: "Product engineering",
            fileUrl: "https://example.com/resume-v2.pdf",
            createdAt: dayjs().subtract(30, "day").toISOString(),
            notes: "Best for full-stack roles",
            tags: ["general", "typescript"],
        },
    ],
    applications: [
        {
            id: 1,
            jobId: 1,
            resumeId: 1,
            appliedDate: dayjs().subtract(10, "day").format("YYYY-MM-DD"),
            currentStage: "Applied",
            recruiterName: "Nina Patel",
            recruiterEmail: "nina@acme.ai",
            createdAt: dayjs().subtract(10, "day").toISOString(),
            followUpDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
            notes: "Ping recruiter if no response by Friday",
        },
    ],
    counters: {
        companies: 2,
        jobs: 2,
        applications: 2,
        resumes: 2,
    },
};

const globalState = globalThis as unknown as { __jobdairyDb?: DbState };

if (!globalState.__jobdairyDb) {
    globalState.__jobdairyDb = seeded;
}

export const db = {
    get companies() {
        return globalState.__jobdairyDb!.companies;
    },
    get jobs() {
        return globalState.__jobdairyDb!.jobs;
    },
    get resumes() {
        return globalState.__jobdairyDb!.resumes;
    },
    get applications() {
        return globalState.__jobdairyDb!.applications;
    },
    createCompany(company: Omit<Company, "id" | "createdAt">): Company {
        const newCompany: Company = {
            ...company,
            id: globalState.__jobdairyDb!.counters.companies++,
            createdAt: new Date().toISOString(),
        };
        globalState.__jobdairyDb!.companies.unshift(newCompany);
        return newCompany;
    },
    createJob(job: Omit<Job, "id" | "createdAt">): Job {
        const newJob: Job = {
            ...job,
            id: globalState.__jobdairyDb!.counters.jobs++,
            createdAt: new Date().toISOString(),
        };
        globalState.__jobdairyDb!.jobs.unshift(newJob);
        return newJob;
    },
    createResume(resume: Omit<Resume, "id" | "createdAt">): Resume {
        const newResume: Resume = {
            ...resume,
            id: globalState.__jobdairyDb!.counters.resumes++,
            createdAt: new Date().toISOString(),
        };
        globalState.__jobdairyDb!.resumes.unshift(newResume);
        return newResume;
    },
    createApplication(
        application: Omit<Application, "id" | "createdAt">,
    ): Application {
        const newApplication: Application = {
            ...application,
            id: globalState.__jobdairyDb!.counters.applications++,
            createdAt: new Date().toISOString(),
        };
        globalState.__jobdairyDb!.applications.unshift(newApplication);
        return newApplication;
    },
    metrics(): DashboardMetrics {
        const totalCompanies = this.companies.filter((company) => !company.archived).length;
        const totalJobs = this.jobs.length;
        const totalApplications = this.applications.length;
        const monthKey = dayjs().format("YYYY-MM");
        const applicationsThisMonth = this.applications.filter((item) =>
            item.appliedDate.startsWith(monthKey),
        ).length;

        const interviewsScheduled = this.applications.filter((item) =>
            ["Interview", "Final Round"].includes(item.currentStage),
        ).length;
        const offersReceived = this.applications.filter(
            (item) => item.currentStage === "Offer",
        ).length;
        const rejectionCount = this.applications.filter(
            (item) => item.currentStage === "Rejected",
        ).length;
        const responded = this.applications.filter(
            (item) => !["Applied", "Wishlist", "Saved"].includes(item.currentStage),
        ).length;

        return {
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
    },
};
