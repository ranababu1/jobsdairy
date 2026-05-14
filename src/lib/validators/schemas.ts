import { z } from "zod";
import { JOB_STATUS } from "@/types/models";

const optionalUrl = z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal(""));

export const companySchema = z.object({
    name: z.string().min(2, "Company name is required"),
    careersUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    location: z.string().optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    archived: z.boolean().default(false),
});

export const jobSchema = z.object({
    companyId: z.coerce.number().positive(),
    title: z.string().min(2, "Job title is required"),
    location: z.string().optional(),
    salaryRange: z.string().optional(),
    jobUrl: optionalUrl,
    jdText: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(JOB_STATUS),
    notes: z.string().optional(),
    recruiterName: z.string().optional(),
    recruiterEmail: z.string().email().optional().or(z.literal("")),
});

export const applicationSchema = z.object({
    jobId: z.coerce.number().positive(),
    resumeId: z.coerce.number().positive(),
    appliedDate: z.string().min(1),
    currentStage: z.string().min(2),
    recruiterName: z.string().optional(),
    recruiterEmail: z.string().email().optional().or(z.literal("")),
    notes: z.string().optional(),
    followUpDate: z.string().optional(),
});

export const resumeSchema = z.object({
    versionName: z.string().min(2),
    focusArea: z.string().optional(),
    fileUrl: optionalUrl,
    notes: z.string().optional(),
    tags: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ResumeInput = z.infer<typeof resumeSchema>;
