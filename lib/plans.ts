export type Plan = "basic" | "pro" | "vip";
export const PLAN_ORDER: Plan[] = ["basic", "pro", "vip"];

export function planFromZeroLink(url: string): Plan | null {
  const u = url.toLowerCase();
  if (u.includes("/vip")) return "vip";
  if (u.includes("/pro")) return "pro";
  if (u.includes("/basic")) return "basic";
  return null;
}

export function secondsForPlan(plan: Plan, yearly = false) {
  const days = yearly ? 365 : 30;
  return days * 24 * 60 * 60;
}
