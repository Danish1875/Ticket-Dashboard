import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  }
  return config;
});

// Auth API calls
export const authApi = {
  sendOtp: (email: string) => api.post("/auth/send-otp", { email }),
  verifyOtp: (email: string, otpCode: string) =>
    api.post("/auth/verify-otp", { email, otpCode }),
  verifySuperUser: (password: string) =>
    api.post("/auth/verify-super-user", { password }),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get("/projects"),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post("/projects", data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Tickets API
export const ticketsApi = {
  getAll: (projectId?: string) =>
    api.get("/tickets", { params: projectId ? { projectId } : {} }),
  getOne: (id: string) => api.get(`/tickets/${id}`),
  create: (data: {
    title: string;
    description?: string;
    projectId: string;
    status?: string;
  }) => api.post("/tickets", data),
  update: (
    id: string,
    data: { title?: string; description?: string; status?: string }
  ) => api.patch(`/tickets/${id}`, data),
  move: (id: string, status: string) =>
    api.patch(`/tickets/${id}/move`, { status }),
  delete: (id: string) => api.delete(`/tickets/${id}`),
};
