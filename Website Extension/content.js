console.log("NaviGuide content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_TEXT") {
    const text = document.body.innerText.slice(0, 8000);
    sendResponse({ text });
  }
});
