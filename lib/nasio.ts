import jwt from "jsonwebtoken";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

// Your six Zero Links
export const PLANS = [
  { id: "basic", url: "https://nas.io/growfinitys/zerolink/basic" },
  { id: "basic-yearly", url: "https://nas.io/growfinitys/zerolink/basic-yearly" },
  { id: "pro", url: "https://nas.io/growfinitys/zerolink/pro" },
  { id: "pro-yearly", url: "https://nas.io/growfinitys/zerolink/pro-yearly" },
  { id: "vip", url: "https://nas.io/growfinitys/zerolink/vip" },
  { id: "vip-yearly", url: "https://nas.io/growfinitys/zerolink/vip-yearly" }
];

export function makeReturnUrl(planId: string, email: string) {
  const token = jwt.sign({ email, planId }, JWT_SECRET, { expiresIn: "30m" });
  return `${SITE_URL}/join/success?token=${encodeURIComponent(token)}`;
}
