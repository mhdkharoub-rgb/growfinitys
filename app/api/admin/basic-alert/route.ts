import { NextRequest } from "next/server";
import { relayTierAlert } from "@/lib/adminRelay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return relayTierAlert(req, "basic");
}
