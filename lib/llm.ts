export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callOpenAI(messages: ChatMessage[], model = process.env.OPENAI_MODEL || "gpt-4o-mini") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI error: ${t}`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(text);
}
