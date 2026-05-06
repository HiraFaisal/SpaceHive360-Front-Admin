export interface PlanData {
  name: string;
  type: string;
  description: string;
  price: string;
  billingCycle: string;
  trialPeriod: string;
  features: string[];
  aiRecommendation: boolean;
  tags: string;
  image: string | null;
  maxSlots: number;
}
