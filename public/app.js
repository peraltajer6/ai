const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let messageHistory = JSON.parse(localStorage.getItem("messageHistory")) || [
  { role: "system", content: "You are Jeremy, a curious and funny AI." }
];

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.textContent = text;
  div.style.margin = "5px 0";
  div.style.padding = "8px";
  div.style.borderRadius = "8px";
  div.style.maxWidth = "80%";
  div.style.wordWrap = "break-word";

  if (sender === "AI") {
    div.style.background = "#e0f0ff";
    div.style.alignSelf = "flex-start";
  } else {
    div.style.background = "#d4edda";
    div.style.alignSelf = "flex-end";
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastAIMessage(text) {
  const messages = chatBox.querySelectorAll("div");
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].textContent === "…thinking…") {
      messages[i].textContent = text;
      messages[i].style.background = "#e0f0ff";
      break;
    }
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  userInput.value = "";
  appendMessage("AI", "…thinking…");

  messageHistory.push({ role: "user", content: message });
  localStorage.setItem("messageHistory", JSON.stringify(messageHistory));

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-3.5-mini", messages: messageHistory })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "[No response]";
    updateLastAIMessage(aiMessage);

    messageHistory.push({ role: "assistant", content: aiMessage });
    localStorage.setItem("messageHistory", JSON.stringify(messageHistory));

  } catch (err) {
    updateLastAIMessage("[Error: " + err.message + "]");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

// Load saved messages
window.addEventListener("load", () => {
  messageHistory.forEach(msg => {
    if (msg.role === "user") appendMessage("You", msg.content);
    if (msg.role === "assistant") appendMessage("AI", msg.content);
  });
});
