const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const output = document.getElementById("output");

askBtn.addEventListener("click", async () => {
  output.textContent = "Thinking...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_TEXT" }, async (page) => {
    if (!page || !page.text) {
      output.textContent = "No page content received.";
      return;
    }

    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questionInput.value,
        pageText: page.text,
        url: page.url
      })
    });

    const data = await response.json();

    // ✅ THIS is the key fix
    output.textContent = data.answer;
  });
});
