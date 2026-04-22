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
