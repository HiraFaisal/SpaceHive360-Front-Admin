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

export const getPlanMemberships = async () => {
  try {
    const res = await api.get("/api/PlanMemberships");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch plan memberships");
  }
};
