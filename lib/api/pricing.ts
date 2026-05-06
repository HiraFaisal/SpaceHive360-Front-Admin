import axios from "axios";
import api from "./axios";

const AI_SERVICE_URL = "http://localhost:8001";

// Fetch aggregated plans (Memberships + Bookings) from Backend
export const getAggregatedPlans = async () => {
    try {
        const res = await api.get("/api/Plans/company");
        return res.data;
    } catch (err: any) {
        throw new Error("Failed to fetch aggregated plans");
    }
};

// Fetch AI analysis for a specific plan
export const analyzePricing = async (planId: string, currentPrice: number) => {
    try {
        // We use standard axios here because it's a different base URL
        const token = localStorage.getItem("adminToken"); // Or however it's stored
        const res = await axios.post(`${AI_SERVICE_URL}/api/analyze-pricing`, {
            plan_id: planId,
            current_price: currentPrice
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err: any) {
        console.error("AI Analysis failed:", err);
        throw new Error("Failed to get AI pricing recommendation");
    }
};
