// lib/api/auth.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, data, {
      headers: { "Content-Type": "application/json" },
    });
    // The backend returns { token: "...", expiration: "..." }
    return response.data.token;
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