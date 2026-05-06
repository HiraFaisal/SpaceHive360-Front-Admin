// lib/api/paymentTerms.ts

import api from "./axios";

export const getPaymentTerms = async () => {
  try {
    const res = await api.get("/api/payment-terms");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to fetch payment terms");
  }
};
