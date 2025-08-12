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

export const lessonAPI = {
  getCourseLessons: (courseId: string) =>
    api.get(`/lessons/course/${courseId}`),

  getLesson: (lessonId: string) => api.get(`/lessons/${lessonId}`),

  getCourseProgress: (courseId: string) =>
    api.get(`/lessons/course/${courseId}/progress`),

  updateLessonProgress: (
    lessonId: string,
    data: { isCompleted?: boolean; timeSpent?: number }
  ) => api.put(`/lessons/${lessonId}/progress`, data),
};

export const courseAPI = {
  getAllCourses: () => api.get("/courses"),

  getCourse: (courseId: string) => api.get(`/courses/${courseId}`),

  getMyEnrolledCourses: () => api.get("/courses/my/enrolled"),

  enrollInCourse: (courseId: string) => api.post(`/courses/${courseId}/enroll`),

  purchaseCourse: (courseId: string) =>
    api.post(`/courses/${courseId}/purchase`),

  unenrollFromCourse: (courseId: string) =>
    api.delete(`/courses/${courseId}/enroll`),
};

export const purchaseAPI = {
  getLearningDashboard: () => api.get("/purchases/dashboard"),
  getUserPurchases: () => api.get("/purchases/history"),
  checkCoursePurchase: (courseId: string) =>
    api.get(`/purchases/check/${courseId}`),
};

export default api;
