export type Course = {
  category: string;
  language: string;
  tutors: number;
};

export const courses: Course[] = [
  {
    category: "Web Development - Front End",
    language: "HTML/CSS/Javascript",
    tutors: 20,
  },
  {
    category: "Web Development - Back End",
    language: "Node.JS/Java/SpringBoot",
    tutors: 10,
  },
  { category: "Software Development", language: "Python/C#/C++", tutors: 30 },
  {
    category: "Networking & Security",
    language: "Python, Bash, Cisco Tools",
    tutors: 17,
  },
  {
    category: "Mobile Development",
    language: "React Native/Flutter",
    tutors: 15,
  },
  {
    category: "Data Science",
    language: "Python, R, SQL, Machine Learning",
    tutors: 25,
  },
  {
    category: "DevOps & Cloud",
    language: "Docker, Kubernetes, AWS, Azure",
    tutors: 12,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
  },
];

export const toCourseSlug = (language: string): string =>
  language
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const findCourseBySlug = (slug: string): Course | undefined =>
  courses.find((c) => toCourseSlug(c.language) === slug);
