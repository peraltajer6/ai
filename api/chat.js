import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const body = req.body;

  try {
    const groqResponse = await fetch("https://api.groq.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!groqResponse.ok) {
      const text = await groqResponse.text();
      return res.status(500).json({ error: `Groq error: ${text}` });
    }

    const data = await groqResponse.json();
    res.status(200).json(data);

  } catch (err) {
    console.error("Fetch to Groq failed:", err);
    res.status(500).json({ error: "fetch failed" });
  }
}
