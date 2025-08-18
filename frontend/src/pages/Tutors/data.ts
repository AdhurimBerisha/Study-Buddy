export type Tutor = {
  id: string;
  category: string;
  rating: number;
  lessons: number;
  name: string;
  headline: string;
  description: string;
  speaks: string;
  trialRate: string;
};

export const tutors: Tutor[] = [
  {
    id: "jaxon-clarke",
    category: "Web Development",
    rating: 4.9,
    lessons: 125,
    name: "Jaxon Clarke",
    headline: "Web Developer with over 10+ years of experience from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native), French C1",
    trialRate: "USD 6.50",
  },
  {
    id: "amilia-luna",
    category: "Software Development",
    rating: 4.3,
    lessons: 100,
    name: "Amilia Luna",
    headline:
      "Software Engineer with over 10+ years of experience from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native)",
    trialRate: "USD 6.00",
  },
  {
    id: "amilia-luna",
    category: "English Language",
    rating: 4.3,
    lessons: 100,
    name: "Amilia Luna",
    headline: "Native English Teacher from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native)",
    trialRate: "USD 6.00",
  },
  {
    id: "amilia-luna",
    category: "English Language",
    rating: 4.3,
    lessons: 100,
    name: "Amilia Luna",
    headline: "Native English Teacher from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native)",
    trialRate: "USD 6.00",
  },
  {
    id: "amilia-luna",
    category: "English Language",
    rating: 4.3,
    lessons: 100,
    name: "Amilia Luna",
    headline: "Native English Teacher from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native)",
    trialRate: "USD 6.00",
  },
];

export const toTutorSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const findTutorBySlug = (slug: string): Tutor | undefined =>
  tutors.find((t) => toTutorSlug(t.name) === slug || t.id === slug);
