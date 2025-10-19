"use client";

import { PLANS } from "@/lib/nasio";

export default function Pricing() {
  return (
    <section>
      <h2>Choose your plan</h2>
      <ul>
        {PLANS.map(p => (
          <li key={p.id} style={{ margin: "12px 0" }}>
            <a href={p.url} target="_blank" rel="noreferrer">Subscribe: {p.id}</a>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24, opacity: 0.7 }}>
        After payment, Nas.io sends you to the success page — you’ll get instant access.
      </p>
    </section>
  );
}
