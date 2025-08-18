export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  language?: string;
  thumbnail?: string;
  totalLessons?: number;
  tutorId?: string;
  createdAt: string;
  tutor?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface DashboardStats {
  users: {
    total: number;
    regular: number;
    admin: number;
    tutor: number;
    recent: number;
  };
  courses: {
    total: number;
    recent: number;
  };
  lessons: {
    total: number;
  };
  purchases: {
    total: number;
  };
}

export interface Tutor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateUserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "user" | "tutor" | "admin";
}

export interface CreateCourseForm {
  title: string;
  description: string;
  category: string;
  language: string;
  level: string;
  price: number;
  thumbnail: string;
  totalLessons: number;
  tutorId: string;
}

export interface Message {
  type: "success" | "error";
  text: string;
}
