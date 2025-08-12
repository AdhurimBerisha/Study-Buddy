export interface Tutor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  totalStudents: number;
  totalLessons: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
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
