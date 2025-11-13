import { handleAdminRelay } from "@/lib/adminRelay";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return handleAdminRelay(req, "vip");
}
