import { toCourseSlug } from "./data";

export type LessonResource = { label: string; url: string };
export type Lesson = {
  id: string;
  title: string;
  content: string;
  resources?: LessonResource[];
};

const make = (language: string, lessons: Lesson[]) => ({
  slug: toCourseSlug(language),
  lessons,
});

const datasets = [
  make("HTML/CSS/Javascript", [
    {
      id: "intro",
      title: "Introduction",
      content:
        "Welcome to Front-end foundations. In this lesson you'll understand how HTML structures the page, CSS styles it, and JavaScript adds behavior.",
      resources: [
        { label: "HTML Cheatsheet (PDF)", url: "#" },
        { label: "CSS Flexbox Guide", url: "#" },
      ],
    },
    {
      id: "fundamentals",
      title: "Fundamentals",
      content:
        "Dive into semantic HTML, modern CSS (Flexbox/Grid), and ES6+ syntax. Practice by building a responsive landing page.",
      resources: [{ label: "Starter Template", url: "#" }],
    },
    {
      id: "practice",
      title: "Practice Exercise",
      content:
        "Recreate a component library button set and a simple navbar. Focus on accessibility and keyboard navigation.",
    },
    {
      id: "summary",
      title: "Summary & Next Steps",
      content:
        "Summarize key takeaways and explore advanced topics like state-driven UI and component architectures.",
    },
  ]),
  make("Node.JS/Java/SpringBoot", [
    {
      id: "intro",
      title: "Introduction",
      content: "Overview of backend paradigms and REST.",
    },
    {
      id: "fundamentals",
      title: "Fundamentals",
      content: "Routing, controllers, and persistence basics.",
    },
    {
      id: "practice",
      title: "Practice Exercise",
      content: "Build a CRUD API for a notes app.",
    },
    {
      id: "summary",
      title: "Summary & Next Steps",
      content: "Testing, deployment, and observability.",
    },
  ]),
];

const bySlug: Record<string, Lesson[]> = datasets.reduce((acc, d) => {
  acc[d.slug] = d.lessons;
  return acc;
}, {} as Record<string, Lesson[]>);

export const getCurriculumBySlug = (slug: string): Lesson[] =>
  bySlug[slug] || [];
