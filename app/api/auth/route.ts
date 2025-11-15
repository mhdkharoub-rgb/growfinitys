import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieKeys = Array.from(cookies().keys());
  return NextResponse.json({ cookies: cookieKeys });
}
