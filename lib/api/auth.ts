// lib/api/auth.ts
import api from "./axios";

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<string> => {
  try {
    const response = await api.post(`api/auth/login`, data);

    // Handle both cases: response.data being the token string itself OR an object with a token property
    return typeof response.data === 'string' ? response.data : response.data.token;

  } catch (err: any) {
    let message = "Login failed";

    if (err.response) {
      if (typeof err.response.data === "string") {
        message = err.response.data;
      } else if (err.response.data?.message) {
        message = err.response.data.message;
      } else if (err.response.data?.Message) { // Backend sometimes uses PascalCase
        message = err.response.data.Message;
      }
    } else {
      message = "Connection failed to backend. Please check if the server is running.";
    }

    throw new Error(message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("api/auth/forgot-password", { email });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to request password reset");
  }
};

export const verifyResetCode = async (email: string, code: string) => {
  try {
    const response = await api.post("api/auth/verify-reset-code", { email, code });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Invalid reset code");
  }
};

export const resetPassword = async (data: any) => {
  try {
    const response = await api.post("api/auth/reset-password", data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to reset password");
  }
};