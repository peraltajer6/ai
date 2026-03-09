fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gpt-3.5-mini",
    messages: [
      { role: "system", content: "You are Jeremy, a curious and funny AI." },
      { role: "user", content: "Hello AI, respond with a short test message." }
    ]
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
