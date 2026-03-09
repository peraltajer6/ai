import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("Received request:", req.method);

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Only POST allowed" });
  }

  let body;
  try {
    body = req.body;
    console.log("Request body:", body);
  } catch (err) {
    console.error("Failed to parse JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing!");
    return res.status(500).json({ error: "GROQ_API_KEY not set" });
  }

  try {
    const groqResponse = await fetch("https://api.groq.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const text = await groqResponse.text(); // get text first for debug

    if (!groqResponse.ok) {
      console.error("Groq API error:", groqResponse.status, text);
      return res.status(500).json({ error: `Groq API error: ${groqResponse.status} - ${text}` });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Groq response as JSON:", text);
      return res.status(500).json({ error: "Invalid JSON from Groq", raw: text });
    }

    console.log("Groq API response:", data);
    res.status(200).json(data);

  } catch (err) {
    console.error("Fetch to Groq failed:", err);
    res.status(500).json({ error: "fetch failed", details: err.message });
  }
}
