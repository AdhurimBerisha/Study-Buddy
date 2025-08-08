import TutorCard from "./TutorsCard";
import { FaUserCircle } from "react-icons/fa";
import { tutors } from "./data";

const TutorsGrid = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 flex flex-col items-center">
      {tutors.map((tutor, index) => (
        <TutorCard key={index} avatar={<FaUserCircle />} {...tutor} />
      ))}
    </section>
  );
};

export default TutorsGrid;
