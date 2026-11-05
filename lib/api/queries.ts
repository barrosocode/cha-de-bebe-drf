"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { asList } from "@/lib/format";
import { api } from "./client";
import type { DashboardData, Gift, Guest, Invite, User } from "./types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get<User>("/auth/me/", { baseURL: "/api" })).data,
    retry: false,
  });
}

export function useGuests() {
  return useQuery({
    queryKey: ["guests"],
    queryFn: async () => asList<Guest>((await api.get("/guests/")).data, "convidados"),
  });
}

export function useGuest(id: string) {
  return useQuery({
    queryKey: ["guests", id],
    queryFn: async () => (await api.get<Guest>(`/guests/${id}/`)).data,
    enabled: id !== "novo",
  });
}

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => asList<Invite>((await api.get("/invites/")).data, "convites"),
  });
}

export function useInvite(id: string) {
  return useQuery({
    queryKey: ["invites", id],
    queryFn: async () => (await api.get<Invite>(`/invites/${id}/`)).data,
    enabled: id !== "novo",
  });
}

export function useGifts() {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: async () => asList<Gift>((await api.get("/gifts/")).data, "presentes"),
  });
}

export function useGift(id: string) {
  return useQuery({
    queryKey: ["gifts", id],
    queryFn: async () => (await api.get<Gift>(`/gifts/${id}/`)).data,
    enabled: id !== "novo",
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get<DashboardData>("/dashboard/")).data,
    retry: false,
  });
}

export function useDeleteResource(resource: "guests" | "invites" | "gifts") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/${resource}/${id}/`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [resource] });
      if (resource === "guests" || resource === "gifts") {
        await queryClient.invalidateQueries({ queryKey: ["guests"] });
      }
    },
  });
}
