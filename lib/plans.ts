export type Plan = "basic" | "pro" | "vip";

export function planFromZeroLink(url: string): Plan | null {
  const u = url.toLowerCase();
  if (u.includes("/vip")) return "vip";
  if (u.includes("/pro")) return "pro";
  if (u.includes("/basic")) return "basic";
  return null;
}

export function secondsForPlan(plan: Plan, yearly = false) {
  return (yearly ? 365 : 30) * 24 * 60 * 60;
}
