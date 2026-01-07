function mountChatbot() {
  const widget = document.getElementById("chat-widget");

  widget.innerHTML = `
    <div style="position:fixed; bottom:20px; right:20px; width:320px; background:#f2f2f2; border-radius:10px; padding:10px;">
      <h3>AI Concierge Assistant</h3>

      <input id="user-query" style="width:100%; padding:8px; margin-bottom:8px;" placeholder="Ask me anything...">

      <button onclick="sendQuery()" style="width:100%; padding:8px; cursor:pointer;">Send</button>

      <div id="bot-response" style="margin-top:10px; font-size:14px;"></div>
    </div>
  `;
}

async function sendQuery() {
  const input = document.getElementById("user-query").value;
  const output = document.getElementById("bot-response");

  output.innerText = "Thinking...";

  try {
    const res = await fetch("https://YOUR_BACKEND_URL/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input })
    });

    const data = await res.json();

    output.innerText = data.answer + "\n\nSTEPS:\n" + data.steps.join("\n");
  } catch (err) {
    output.innerText = "Backend not connected yet.";
  }
}

window.onload = mountChatbot;
