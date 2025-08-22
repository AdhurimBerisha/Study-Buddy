export type Course = {
  category: string;
  tutors: number;
  price: number;
};

export const courses: Course[] = [
  {
    category: "Web Development - Front End",
    tutors: 20,
    price: 99,
  },
  {
    category: "Web Development - Back End",
    tutors: 10,
    price: 119,
  },
  {
    category: "Software Development",
    tutors: 30,
    price: 109,
  },
  {
    category: "Networking & Security",
    tutors: 17,
    price: 129,
  },
  {
    category: "Mobile Development",
    tutors: 15,
    price: 99,
  },
  {
    category: "Data Science",
    tutors: 25,
    price: 139,
  },
  {
    category: "DevOps & Cloud",
    tutors: 12,
    price: 149,
  },
  {
    category: "Game Development",
    tutors: 8,
    price: 99,
  },
];

export const toCourseSlug = (category: string): string =>
  category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const findCourseBySlug = (slug: string): Course | undefined =>
  courses.find((c) => toCourseSlug(c.category) === slug);
