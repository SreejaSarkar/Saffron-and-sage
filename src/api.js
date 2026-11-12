// Thin fetch wrapper. In dev, CRA proxies /api to the Express server (port 5000).
const BASE = "/api";
const TOKEN_KEY = "ss_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, options = {}) {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || (data.errors && data.errors.join(" ")))) ||
      "Something went wrong. Please try again.";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getInfo: () => request("/info"),
  getMenu: (params = "") => request(`/menu${params}`),
  getCategories: () => request("/menu/categories"),
  checkAvailability: (date, time) =>
    request(`/reservations/availability?date=${date}&time=${time}`),
  createReservation: (body) =>
    request("/reservations", { method: "POST", body: JSON.stringify(body) }),
  getMyReservations: () => request("/reservations/mine"),
  cancelReservation: (id) =>
    request(`/reservations/${id}`, { method: "DELETE" }),
  sendContact: (body) =>
    request("/contact", { method: "POST", body: JSON.stringify(body) }),
  getReviews: () => request("/reviews"),
  addReview: (body) =>
    request("/reviews", { method: "POST", body: JSON.stringify(body) }),
  subscribe: (email) =>
    request("/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  // Auth
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
};
