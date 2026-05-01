// lib/api/cities.ts
import api from "./axios";

export interface City {
  recId: string;
  name: string;
  country?: string;
  isActive: boolean;
}

export const getCities = async () => {
  const res = await api.get("/api/city");
  return res.data;
};

export const createCity = async (data: Partial<City>) => {
  const res = await api.post("/api/city", data);
  return res.data;
};

export const findOrCreateCity = async (name: string) => {
    if (!name) return null;
    const cities = await getCities();
    const existing = cities.find((c: City) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.recId;
    
    // Create new city
    const res = await createCity({ name });
    return res.id; // Backend returns { Id: ... }
};
