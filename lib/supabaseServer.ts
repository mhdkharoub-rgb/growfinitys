"use server";

import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export function supabaseServer() {
  return createServerComponentClient<Database>({ cookies, headers });
import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export function supabaseServer() {
  return createServerComponentClient<Database>({ cookies });
}

export function supabaseRoute(cookieStore: ReturnType<typeof cookies>) {
  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
}
