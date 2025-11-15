"use server";

import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export function supabaseServer() {
  return createServerComponentClient<Database>({ cookies, headers });
}
