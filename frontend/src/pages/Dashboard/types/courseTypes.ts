export interface Lesson {
  title: string;
  content: string;
  order: number;
  duration?: number;
  resources?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: FileList | string;
  lessons: Lesson[];
}
