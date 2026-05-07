import api from "./axios";

export interface FaqDto {
  recId: string;
  fkCategory: string;
  question: string;
  answer: string;
  steps?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface FaqCategoryDto {
  recId: string;
  name: string;
  icon: string;
  displayOrder: number;
  faqs: FaqDto[];
}

export const fetchAllFaqs = async (): Promise<FaqCategoryDto[]> => {
  const response = await api.get("/api/Support/faqs");
  return response.data;
};

// Super Admin Management APIs
export const createCategory = async (data: { name: string; icon: string; displayOrder: number }) => {
  const response = await api.post("/api/Support/categories", data);
  return response.data;
};

export const updateCategory = async (id: string, data: { name: string; icon: string; displayOrder: number }) => {
  await api.put(`/api/Support/categories/${id}`, data);
};

export const deleteCategory = async (id: string) => {
  await api.delete(`/api/Support/categories/${id}`);
};

export const createFaq = async (data: { fkCategory: string; question: string; answer: string; steps?: string }) => {
  const response = await api.post("/api/Support/faqs", data);
  return response.data;
};

export const updateFaq = async (id: string, data: { fkCategory: string; question: string; answer: string; steps?: string }) => {
  await api.put(`/api/Support/faqs/${id}`, data);
};

export const deleteFaq = async (id: string) => {
  await api.delete(`/api/Support/faqs/${id}`);
};
