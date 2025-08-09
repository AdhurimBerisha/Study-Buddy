export type Course = {
  category: string;
  language: string;
  tutors: number;
  price: number;
};

export const courses: Course[] = [
  {
    category: "Web Development - Front End",
    language: "HTML/CSS/Javascript",
    tutors: 20,
    price: 99,
  },
  {
    category: "Web Development - Back End",
    language: "Node.JS/Java/SpringBoot",
    tutors: 10,
    price: 119,
  },
  {
    category: "Software Development",
    language: "Python/C#/C++",
    tutors: 30,
    price: 109,
  },
  {
    category: "Networking & Security",
    language: "Python, Bash, Cisco Tools",
    tutors: 17,
    price: 129,
  },
  {
    category: "Mobile Development",
    language: "React Native/Flutter",
    tutors: 15,
    price: 99,
  },
  {
    category: "Data Science",
    language: "Python, R, SQL, Machine Learning",
    tutors: 25,
    price: 139,
  },
  {
    category: "DevOps & Cloud",
    language: "Docker, Kubernetes, AWS, Azure",
    tutors: 12,
    price: 149,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
    price: 99,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
    price: 99,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
    price: 99,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
    price: 99,
  },
];

export const toCourseSlug = (language: string): string =>
  language
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const findCourseBySlug = (slug: string): Course | undefined =>
  courses.find((c) => toCourseSlug(c.language) === slug);
