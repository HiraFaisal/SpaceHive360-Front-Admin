// lib/api/workspaceTypes.ts

import api from "./axios";

export const getWorkspaceTypes = async () => {
  try {
    const res = await api.get("/api/workspace-types");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch workspace types");
  }
};


export const createWorkspaceType = async (data: {
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}) => {
  const res = await api.post("/api/workspace-types", data);
  return res.data;
};


export const deleteWorkspaceType = async (id: string) => {
  const res = await api.delete(`/api/workspace-types/${id}`);
  return res.data;
};

export const updateWorkspaceType = async (id: string, data: any) => {
  await api.put(`/api/workspace-types/${id}`, data);
};