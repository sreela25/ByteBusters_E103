// Create a proper URL with query parameters
export function createPageUrl(page, params = {}) {
  let url = page + ".html";

  const query = new URLSearchParams(params).toString();

  if (query) {
    url += "?" + query;
  }

  return url;
}

// Helper to format timestamps nicely
export function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Simple ID generator for new conversations (optional)
export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}
