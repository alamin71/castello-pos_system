import type {
  StatCardData,
  OrderSummaryCardData,
  PlatformBreakdown,
  SalesPoint,
} from "@/types/dashboard.types";

export const STAT_CARDS: StatCardData[] = [
  { label: "Total Order", value: "929", deltaPercent: 39, vsLabel: "569" },
  { label: "Gross Sales", value: "3,266,097 kr.", deltaPercent: -42, vsLabel: "5,619,509 kr." },
  { label: "Discount", value: "2,51,828 kr.", deltaPercent: -31, vsLabel: "3,65,801 kr." },
  { label: "Taxes", value: "5,73,259 kr.", deltaPercent: 42, vsLabel: "3,34,835 kr." },
];

export const ORDER_SUMMARY_CARDS: OrderSummaryCardData[] = [
  { label: "New Orders", sublabel: "pending in the queue", count: 3, amount: "10,850 kr." },
  { label: "Preparing Orders", sublabel: "In the kitchen", count: 3, amount: "10,850 kr." },
  { label: "Unpaid Orders", sublabel: "Payment need to be collected", count: 3, amount: "10,850 kr." },
  { label: "Paid Orders", sublabel: "Completely paid", count: 3, amount: "10,850 kr." },
];

export const PLATFORM_BREAKDOWN: PlatformBreakdown[] = [
  { platform: "POS", count: 31, amount: "83,890 kr.", color: "var(--secondary)" },
  { platform: "KIOSK", count: 25, amount: "79,150 kr.", color: "#e5e5e5" },
  { platform: "WEB", count: 17, amount: "31,785 kr.", color: "#3f3f3f" },
];

export const PLATFORM_TOTAL = PLATFORM_BREAKDOWN.reduce((sum, p) => sum + p.count, 0);

export const TOTAL_SALES: SalesPoint[] = [
  { date: "1", value: 1000000 },
  { date: "4", value: 1350000 },
  { date: "7", value: 1580000 },
  { date: "10", value: 1250000 },
  { date: "13", value: 1600000 },
  { date: "15", value: 1350000 },
  { date: "18", value: 1450000 },
  { date: "21", value: 1300000 },
  { date: "24", value: 900000 },
  { date: "27", value: 1550000 },
  { date: "31", value: 1650000 },
];
