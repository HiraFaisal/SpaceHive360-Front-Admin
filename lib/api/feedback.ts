import axios from "axios";
import api from "./axios";

const AI_SERVICE_URL = "http://localhost:8000";

export interface Feedback {
  recId: string;
  fkLocation?: string;
  locationName?: string;
  fkPayment?: string;
  memberName?: string;
  memberEmail?: string;
  category?: string;
  experience?: string;
  comments: string;
  rating?: number;
  sentiment?: string;
  sentimentScore?: number;
  isActive: boolean;
  createdAt: string;
  // Added fields for UI logic if needed
  workspaceName?: string; // mapping from locationName or workspace
  planName?: string; // mapping from category or experience
}

export interface LocationSentimentSummary {
  locationId: string;
  locationName: string;
  aiSummary: string;
  totalReviews: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

export const getFeedbacks = async (recId?: string) => {
  const url = recId ? `/api/feedback?recId=${recId}` : "/api/feedback";
  const res = await api.get(url);
  return res.data as Feedback[];
};

export const getLocationSummary = async (locationId: string) => {
  const res = await api.get(`/api/feedback/location-summary/${locationId}`);
  return res.data as LocationSentimentSummary;
};

export const summarizeReviews = async (reviews: string[]) => {
  const res = await axios.post(`${AI_SERVICE_URL}/summarize-feedback`, { reviews });
  return res.data.summary as string;
};
