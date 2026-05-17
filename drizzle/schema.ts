import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const companies = sqliteTable("companies", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    careersUrl: text("careers_url"),
    linkedinUrl: text("linkedin_url"),
    location: text("location"),
    category: text("category"),
    tags: text("tags"),
    notes: text("notes"),
    priority: text("priority"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const jobs = sqliteTable("jobs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    companyId: integer("company_id").notNull(),
    title: text("title").notNull(),
    location: text("location"),
    salaryRange: text("salary_range"),
    jobUrl: text("job_url"),
    jdText: text("jd_text"),
    source: text("source"),
    status: text("status"),
    notes: text("notes"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const resumes = sqliteTable("resumes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    versionName: text("version_name").notNull(),
    focusArea: text("focus_area"),
    fileUrl: text("file_url"),
    notes: text("notes"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const applications = sqliteTable("applications", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    jobId: integer("job_id").notNull(),
    resumeId: integer("resume_id").notNull(),
    appliedDate: text("applied_date"),
    currentStage: text("current_stage"),
    recruiterName: text("recruiter_name"),
    recruiterEmail: text("recruiter_email"),
    notes: text("notes"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
