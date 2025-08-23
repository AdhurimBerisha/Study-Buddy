export interface Tutor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  expertise: string[];
  totalStudents: number;
  totalLessons: number;
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  courses?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    thumbnail?: string;
  }>;
}

export interface TutorListResponse {
  tutors: Tutor[];
  total: number;
  limit: number;
  offset: number;
}
