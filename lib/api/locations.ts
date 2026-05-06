// lib/api/locations.ts
import api from "./axios";

export interface Location {
  recId: string;
  fkCity: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export const getLocations = async () => {
  const res = await api.get("/api/location");
  return res.data;
};

export const createLocation = async (data: Partial<Location>) => {
  const res = await api.post("/api/location", data);
  return res.data;
};

export const updateLocation = async (id: string, data: Partial<Location>) => {
  // backend expects multipart/form-data for update in some controllers, 
  // but let's check if we can use JSON if we don't have files.
  // The LocationController has [Consumes("multipart/form-data")] on Update.
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  const res = await api.put(`/api/location/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteLocation = async (id: string) => {
  const res = await api.delete(`/api/location/${id}`);
  return res.data;
};
