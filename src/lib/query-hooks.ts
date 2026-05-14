"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useCompanies() {
    return useQuery({ queryKey: ["companies"], queryFn: api.getCompanies });
}

export function useCreateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: unknown }) =>
            api.updateCompany(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useJobs() {
    return useQuery({ queryKey: ["jobs"], queryFn: api.getJobs });
}

export function useCreateJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useDeleteJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useApplications() {
    return useQuery({ queryKey: ["applications"], queryFn: api.getApplications });
}

export function useCreateApplication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useUpdateApplication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: unknown }) =>
            api.updateApplication(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useDeleteApplication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useResumes() {
    return useQuery({ queryKey: ["resumes"], queryFn: api.getResumes });
}

export function useCreateResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
    });
}

export function useMetrics() {
    return useQuery({ queryKey: ["metrics"], queryFn: api.getMetrics });
}
