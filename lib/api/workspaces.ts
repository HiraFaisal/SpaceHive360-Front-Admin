// lib/api/workspaces.ts

import api from "./axios";

export const getWorkspaces = async () => {
  try {
    const res = await api.get("/api/workspaces");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch workspaces");
  }
};

export const createWorkspace = async (data: any) => {
  try {
    const res = await api.post("/api/workspaces", data);
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to create workspace");
  }
};

export const updateWorkspace = async (id: string, data: any) => {
  try {
    const res = await api.put(`/api/workspaces/${id}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to update workspace");
  }
};

export const deleteWorkspace = async (id: string) => {
  try {
    const res = await api.delete(`/api/workspaces/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to delete workspace");
  }
};

export const getWorkspaceStats = async () => {
  try {
    const res = await api.get("/api/workspaces/stats");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch workspace stats");
  }
};
