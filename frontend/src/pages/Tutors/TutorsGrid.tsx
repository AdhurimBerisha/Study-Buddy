import TutorCard from "./TutorsCard";
import { FaUserCircle } from "react-icons/fa";
import type { Tutor } from "../../types/tutor";

type Props = {
  items?: Tutor[];
  footer?: React.ReactNode;
};

const TutorsGrid = ({ items, footer }: Props) => {
  if (!items || items.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 dark:border-gray-600 pb-8 mb-8 mt-0 pt-0 relative z-10 flex flex-col items-center">
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No tutors found
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 dark:border-gray-600 pb-8 mb-8 mt-0 pt-0 relative z-10 flex flex-col items-center">
      {items.map((tutor, index) => (
        <TutorCard key={index} avatar={<FaUserCircle />} {...tutor} />
      ))}
      {footer && <div className="mt-6">{footer}</div>}
    </section>
  );
};

export default TutorsGrid;
