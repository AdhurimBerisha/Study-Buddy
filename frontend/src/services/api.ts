import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
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

// Group API functions
export const groupAPI = {
  // Get all public groups
  getAllGroups: () => api.get("/groups"),

  // Get a specific group
  getGroup: (id: string) => api.get(`/groups/${id}`),

  // Create a new group
  createGroup: (data: {
    name: string;
    description?: string;
    category: string;
    level: string;
    maxMembers?: number;
    isPrivate?: boolean;
  }) => api.post("/groups", data),

  // Update a group
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

  // Delete a group
  deleteGroup: (id: string) => api.delete(`/groups/${id}`),

  // Join a group
  joinGroup: (id: string) => api.post(`/groups/${id}/join`),

  // Leave a group
  leaveGroup: (id: string) => api.post(`/groups/${id}/leave`),

  // Get user's groups
  getMyGroups: () => api.get("/groups/user/my"),

  // Send a message to a group
  sendMessage: (
    groupId: string,
    data: {
      content: string;
      messageType?: "text" | "image" | "file" | "link";
      replyTo?: string;
    }
  ) => api.post(`/groups/${groupId}/messages`, data),

  // Get group messages
  getGroupMessages: (groupId: string, page?: number, limit?: number) =>
    api.get(`/groups/${groupId}/messages`, {
      params: { page, limit },
    }),
};

export default api;
