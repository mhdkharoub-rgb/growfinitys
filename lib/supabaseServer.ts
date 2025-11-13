import { cookies, headers } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export function supabaseServer() {
  return createServerComponentClient<Database>({ cookies, headers });
}

export function supabaseRoute() {
  return createRouteHandlerClient<Database>({ cookies, headers });
}
