import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const groupAPI = {
  getAllGroups: () => api.get("/groups"),

  getGroup: (id: string) => api.get(`/groups/${id}`),

  createGroup: (data: {
    name: string;
    description?: string;
    category: string;
    level: string;
    maxMembers?: number;
    isPrivate?: boolean;
  }) => api.post("/groups", data),

  updateGroup: (
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      level?: string;
      maxMembers?: number;
      isPrivate?: boolean;
    }
  ) => api.put(`/groups/${id}`, data),

  deleteGroup: (id: string) => api.delete(`/groups/${id}`),

  joinGroup: (id: string) => api.post(`/groups/${id}/join`),

  leaveGroup: (id: string) => api.post(`/groups/${id}/leave`),

  getMyGroups: () => api.get("/groups/user/my"),
};

export default api;
