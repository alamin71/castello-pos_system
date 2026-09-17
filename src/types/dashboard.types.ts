export interface StatCardData {
  label: string;
  value: string;
  deltaPercent: number;
  vsLabel: string;
}

export interface OrderSummaryCardData {
  label: string;
  sublabel: string;
  count: number;
  amount: string;
}

export interface PlatformBreakdown {
  platform: "POS" | "KIOSK" | "WEB";
  count: number;
  amount: string;
  color: string;
}

export interface SalesPoint {
  date: string;
  value: number;
}
