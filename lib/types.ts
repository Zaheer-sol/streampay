export type BillingType = 'subscription' | 'usage' | 'api';
export type AuthStatus = 'active' | 'paused' | 'expired' | 'cancelled';
export type TxStatus = 'confirmed' | 'pending' | 'failed';

export interface Authorization {
  id: string;
  merchant: string;
  merchantIcon: string;
  token: 'USDC' | 'SOL';
  maxPerTx: number;
  maxPerMonth: number;
  totalCap: number;
  spent: number;
  billingType: BillingType;
  status: AuthStatus;
  createdAt: string;
  expiresAt?: string;
  rateLimit?: number;
}

export interface Subscription {
  id: string;
  service: string;
  serviceIcon: string;
  monthlyCost: number;
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  category: string;
  authId: string;
}

export interface ApiUsageStat {
  merchantId: string;
  merchant: string;
  merchantIcon: string;
  totalRequests: number;
  costPerRequest: number;
  totalCost: number;
  requestsThisMonth: number;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  type: BillingType;
  amount: number;
  status: TxStatus;
  signature: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'charge' | 'renewal' | 'authorization' | 'refund' | 'api_call';
  message: string;
  amount?: number;
  merchant: string;
  merchantIcon: string;
}

export interface SpendingDataPoint {
  date: string;
  amount: number;
  api: number;
  subscriptions: number;
  usage: number;
}

export interface AppState {
  walletConnected: boolean;
  walletAddress: string;
  balance: number;
  authorizations: Authorization[];
  subscriptions: Subscription[];
  apiUsage: ApiUsageStat[];
  transactions: Transaction[];
  activity: ActivityItem[];
  spendingData: SpendingDataPoint[];
  demoMode: boolean;
  onboardingDone: boolean;
  monthlySpend: number;
}
