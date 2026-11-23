const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error("Cannot connect to the backend. Check that the backend server is running.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed. Please try again.");
  }
  return payload;
}

export const taskApi = {
  getAll: () => request("/tasks"),
  create: (task) => request("/tasks", { method: "POST", body: JSON.stringify(task) }),
  update: (id, updates) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" })
};
