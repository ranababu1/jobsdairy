import type { Application, Company, Job, Resume } from "@/types/models";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
    url: string,
    method: HttpMethod = "GET",
    body?: unknown,
): Promise<T> {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({ message: "Request failed" }))) as {
            message?: string;
        };
        throw new Error(errorBody.message || "Request failed");
    }

    return (await response.json()) as T;
}

export const api = {
    getCompanies: () => request<Company[]>("/api/companies"),
    createCompany: (payload: unknown) => request<Company>("/api/companies", "POST", payload),
    updateCompany: (id: number, payload: unknown) =>
        request<Company>(`/api/companies/${id}`, "PUT", payload),
    deleteCompany: (id: number) => request<Company>(`/api/companies/${id}`, "DELETE"),

    getJobs: () => request<Job[]>("/api/jobs"),
    createJob: (payload: unknown) => request<Job>("/api/jobs", "POST", payload),
    updateJob: (id: number, payload: unknown) => request<Job>(`/api/jobs/${id}`, "PUT", payload),
    deleteJob: (id: number) => request<Job>(`/api/jobs/${id}`, "DELETE"),

    getApplications: () => request<Application[]>("/api/applications"),
    createApplication: (payload: unknown) =>
        request<Application>("/api/applications", "POST", payload),
    updateApplication: (id: number, payload: unknown) =>
        request<Application>(`/api/applications/${id}`, "PUT", payload),
    deleteApplication: (id: number) =>
        request<Application>(`/api/applications/${id}`, "DELETE"),

    getResumes: () => request<Resume[]>("/api/resumes"),
    createResume: (payload: unknown) => request<Resume>("/api/resumes", "POST", payload),
    deleteResume: (id: number) => request<Resume>(`/api/resumes/${id}`, "DELETE"),

    getMetrics: () =>
        request<{
            metrics: {
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
            charts: {
                applicationsByMonth: { month: string; value: number }[];
                statusDistribution: { name: string; value: number }[];
                companyCategoryDistribution: { name: string; value: number }[];
                resumePerformance: {
                    resumeVersion: string;
                    applied: number;
                    interviews: number;
                    offers: number;
                }[];
            };
        }>("/api/metrics"),
};
