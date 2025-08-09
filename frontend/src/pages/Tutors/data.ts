export type Tutor = {
  id: string;
  category: string;
  rating: number;
  lessons: number;
  name: string;
  headline: string;
  description: string;
  speaks: string;
  hourlyRate: string;
  trialRate: string;
};

export const tutors: Tutor[] = [
  {
    id: "jaxon-clarke",
    category: "English Language",
    rating: 4.9,
    lessons: 125,
    name: "Jaxon Clarke",
    headline: "Native English Teacher from the U.S.",
    description:
      "consectetur adipisicing elit, sed do eiusmod ut labore et magna aliqua...",
    speaks: "English (Native), French C1",
    hourlyRate: "USD 15.50",
    trialRate: "USD 6.50",
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
    hourlyRate: "USD 14.00",
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
    hourlyRate: "USD 14.00",
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
    hourlyRate: "USD 14.00",
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
    hourlyRate: "USD 14.00",
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
