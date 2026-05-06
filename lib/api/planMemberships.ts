// lib/api/planMemberships.ts

import api from "./axios";

export const createPlanMembership = async (formData: FormData) => {
  try {
    const res = await api.post("/api/PlanMemberships", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create plan membership");
  }
};

export const getPlanMemberships = async (params?: any) => {
  try {
    const res = await api.get("/api/PlanMemberships", { params });
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch plan memberships");
  }
};

export const getPlanMembershipById = async (id: string) => {
  try {
    const res = await api.get(`/api/PlanMemberships/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch plan details");
  }
};

export const deletePlanMembership = async (id: string) => {
  try {
    const res = await api.delete(`/api/PlanMemberships/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to delete plan membership");
  }
};

export const updatePlanMembership = async (id: string, formData: FormData) => {
  try {
    const res = await api.put(`/api/PlanMemberships/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to update plan membership");
  }
};

export const getPlanStats = async () => {
  try {
    const res = await api.get("/api/PlanMemberships/stats");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch plan statistics");
  }
};
