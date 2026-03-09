// /api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("Received request:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const body = req.body;

  if (!process.env.VERCEL_AI_KEY) {
    console.error("VERCEL_AI_KEY missing!");
    return res.status(500).json({ error: "VERCEL_AI_KEY not set" });
  }

  try {
    const response = await fetch("https://api.vercel.com/v1/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VERCEL_AI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-mini",
        input: body.messages.map(m => `${m.role}: ${m.content}`).join("\n")
      })
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Vercel AI error:", response.status, text);
      return res.status(500).json({ error: `Vercel AI error: ${response.status} - ${text}` });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Vercel AI response:", text);
      return res.status(500).json({ error: "Invalid JSON from Vercel AI", raw: text });
    }

    console.log("Vercel AI response:", data);
    res.status(200).json(data);

  } catch (err) {
    console.error("Fetch to Vercel AI failed:", err);
    res.status(500).json({ error: "fetch failed", details: err.message });
  }
}
