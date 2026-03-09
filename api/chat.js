// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Only POST allowed" });
    return;
  }

  const body = await req.json();

  try {
    const response = await fetch("https://api.groq.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`  // Your key is read from Vercel env
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
