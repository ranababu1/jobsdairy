export const JOB_STATUS = [
    "Wishlist",
    "Saved",
    "Applied",
    "OA",
    "Interview",
    "Final Round",
    "Rejected",
    "Offer",
    "Closed",
] as const;

export type JobStatus = (typeof JOB_STATUS)[number];

export type Priority = "low" | "medium" | "high";

export type Company = {
    id: number;
    name: string;
    careersUrl?: string;
    linkedinUrl?: string;
    location?: string;
    category?: string;
    tags?: string[];
    notes?: string;
    priority?: Priority;
    archived?: boolean;
    createdAt: string;
};

export type Job = {
    id: number;
    companyId: number;
    title: string;
    location?: string;
    salaryRange?: string;
    jobUrl?: string;
    jdText?: string;
    source?: string;
    status: JobStatus;
    notes?: string;
    recruiterName?: string;
    recruiterEmail?: string;
    createdAt: string;
};

export type Resume = {
    id: number;
    versionName: string;
    focusArea?: string;
    fileUrl: string;
    notes?: string;
    tags?: string[];
    createdAt: string;
};

export type Application = {
    id: number;
    jobId: number;
    resumeId: number;
    appliedDate: string;
    currentStage: string;
    recruiterName?: string;
    recruiterEmail?: string;
    notes?: string;
    followUpDate?: string;
    createdAt: string;
};

export type DashboardMetrics = {
    totalCompanies: number;
    totalJobs: number;
    totalApplications: number;
    applicationsThisMonth: number;
    interviewsScheduled: number;
    offersReceived: number;
    rejectionCount: number;
    responseRate: number;
    interviewConversionRate: number;
};
