// lib/api/locations.ts

import api from "./axios";

export const getLocations = async () => {
  try {
    const res = await api.get("/api/location");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch locations");
  }
};
