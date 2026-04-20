import api from "./axios";

export interface CompanyRegistrationData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  contactPersonName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export const registerCompany = async (data: CompanyRegistrationData) => {
  try {
    const response = await api.post<ApiResponse<any>>("/api/companies/register", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Connection failed. Please check if the backend server is running at " + process.env.NEXT_PUBLIC_API_URL };
  }
};

export const checkCompanyStatus = async (email: string) => {
  try {
    const response = await api.get<ApiResponse<any>>(`/api/companies/check-status?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: "Connection failed. Please check if the backend server is running." };
  }
};
