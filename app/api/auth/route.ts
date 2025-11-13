import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const allCookies = cookies().getAll();
  const cookieNames = allCookies.map((c) => c.name);
  return NextResponse.json({ cookies: cookieNames });
}
