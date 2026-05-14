import { JOB_STATUS } from "@/types/models";

export const COMPANY_CATEGORIES = [
    "Product",
    "SaaS",
    "Fintech",
    "Enterprise",
    "GCC",
    "AI",
    "Startup",
    "Consulting",
] as const;

export const KANBAN_COLUMNS = [
    "Wishlist",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
] as const;

export const APP_STAGE_OPTIONS = JOB_STATUS;
