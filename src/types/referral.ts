export type ReferralStatus = 'pending' | 'approved' | 'rejected';

export interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ReferralStatus;
  date: string;
}

export interface ReferralFormData {
  name: string;
  email: string;
  phone?: string;
}

export interface ReferralHistoryResponse {
  data: Referral[];
  total: number;
  page: number;
  limit: number;
}

export interface PointsBalance {
  current: number;
  lifetime: number;
}
