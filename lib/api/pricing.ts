import axios from "axios";
import api from "./axios";

const AI_SERVICE_URL = "http://localhost:8000";

// Fetch aggregated plans (Memberships + Bookings) from Backend
export const getAggregatedPlans = async () => {
    try {
        const res = await api.get("/api/Plans/company");
        return res.data;
    } catch (err: any) {
        throw new Error("Failed to fetch aggregated plans");
    }
};

export const analyzePricing = async (plan: any) => {
    try {
        // We use standard axios here because it's a different base URL
        const token = localStorage.getItem("adminToken"); // Or however it's stored
        const res = await axios.post(`${AI_SERVICE_URL}/api/analyze-pricing`, {
            plan_id: plan.recId,
            current_price: plan.price,
            plan_name: plan.name,
            location_name: plan.locationName,
            workspace_type_name: plan.workspaceTypeName,
            workspace_name: plan.workspaceName,
            city_name: plan.cityName,
            description: plan.description,
            plan_type: plan.type
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

export const updatePlanPrice = async (planId: string, newPrice: number) => {
    try {
        const res = await api.post("/api/Plans/update-price", {
            planId,
            newPrice
        });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update plan price");
    }
};
