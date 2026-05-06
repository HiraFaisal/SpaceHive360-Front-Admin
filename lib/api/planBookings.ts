// lib/api/planBookings.ts
import api from "./axios";

export interface PlanBooking {
  recId: string;
  fkCompany?: string;
  fkWorkspace?: string;
  fkWorkspaceType?: string;
  fkLocation?: string;
  name: string;
  description?: string;
  images: string[];
  features: string[];
  startTime?: string; // TimeSpan format from backend
  endTime?: string;
  availableDays: string[];
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  priceType?: string;
  price?: number;
  allowCancellation: boolean;
  requiresApproval: boolean;
  isVisible: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAllPlanBookings = async (params?: any) => {
  try {
    const res = await api.get("/api/PlanBookings", { params });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch plan bookings");
  }
};

export const getPlanBookingById = async (id: string) => {
  try {
    const res = await api.get(`/api/PlanBookings/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch plan booking");
  }
};

export const createPlanBooking = async (formData: FormData) => {
  try {
    const res = await api.post("/api/PlanBookings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create plan booking");
  }
};

export const updatePlanBooking = async (id: string, formData: FormData) => {
  try {
    const res = await api.put(`/api/PlanBookings/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update plan booking");
  }
};

export const deletePlanBooking = async (id: string) => {
  try {
    const res = await api.delete(`/api/PlanBookings/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete plan booking");
  }
};

export const getPlanBookingStats = async () => {
  try {
    const res = await api.get("/api/PlanBookings/stats");
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch plan booking stats");
  }
};
