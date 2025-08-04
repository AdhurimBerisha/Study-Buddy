import { Link } from "react-router-dom";

type CardProps = {
  category: string;
  language: string;
  tutors: number;
};

const LanguageCard = ({ category, language, tutors }: CardProps) => {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center">
      <div className="text-blue-600 border border-blue-600 px-3 py-1 rounded-full inline-block mb-3 font-bold text-sm">
        {category}
      </div>

      {/* Title is now a clickable link */}
      <Link to="/courses">
        <h3 className="text-lg font-semibold text-blue-600  cursor-pointer">
          {language}
        </h3>
      </Link>

      <p className="text-sm text-gray-500">{tutors} Tutors</p>
    </div>
  );
};

export default LanguageCard;
