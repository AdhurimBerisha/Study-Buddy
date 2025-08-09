import TutorCard from "./TutorsCard";
import { FaUserCircle } from "react-icons/fa";
import { tutors as allTutors } from "./data";
import type { Tutor } from "./data";

type Props = {
  items?: Tutor[];
  footer?: React.ReactNode;
};

const TutorsGrid = ({ items, footer }: Props) => {
  const list = items && items.length > 0 ? items : allTutors;
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 -mt-20 pt-8 relative z-10 flex flex-col items-center">
      {list.map((tutor, index) => (
        <TutorCard key={index} avatar={<FaUserCircle />} {...tutor} />
      ))}
      {footer && <div className="mt-6">{footer}</div>}
    </section>
  );
};

export default TutorsGrid;
