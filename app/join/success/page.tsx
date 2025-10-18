"use client";
import { useEffect, useState } from "react";

export default function JoinSuccess() {
  const [status, setStatus] = useState<"idle" | "ok" | "need-login" | "error">("idle");
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planParam = params.get("plan");
    setPlan(planParam);
    if (!planParam) { setStatus("error"); return; }

    // Try to claim. If not logged in, API returns 401.
    fetch("/api/subscription/claim", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ plan: planParam })
    }).then(async (r) => {
      if (r.status === 401) setStatus("need-login");
      else if (r.ok) setStatus("ok");
      else setStatus("error");
    });
  }, []);

  if (status === "idle") return <p>Claiming your plan…</p>;
  if (status === "ok") return <p>All set! <a className="underline" href="/dashboard">Go to dashboard</a>.</p>;
  if (status === "need-login") return <p>Please <a className="underline" href="/login">log in</a> then revisit this page to claim: <code>?plan={plan}</code></p>;
  return <p>Could not claim. Contact support with your receipt.</p>;
}
