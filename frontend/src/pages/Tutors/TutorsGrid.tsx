import TutorCard from "./TutorsCard";
import { FaUserCircle } from "react-icons/fa";

const tutors = [
  {
    avatar: <FaUserCircle />,
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
    avatar: <FaUserCircle />,
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

const TutorsGrid = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 flex flex-col items-center">
      {tutors.map((tutor, index) => (
        <TutorCard key={index} {...tutor} />
      ))}
    </section>
  );
};

export default TutorsGrid;
