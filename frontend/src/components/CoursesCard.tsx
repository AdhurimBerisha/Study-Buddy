import { Link } from "react-router-dom";
import {
  FaHtml5,
  FaNodeJs,
  FaPython,
  FaMicrosoft,
  FaNetworkWired,
  FaCode,
  FaUsers,
} from "react-icons/fa";
import { SiSpringboot } from "react-icons/si";

type CardProps = {
  category: string;
  language: string;
  tutors: number;
};

const coursesIcons: Record<string, React.ReactNode> = {
  html: <FaHtml5 className="text-4xl text-orange-500" />,
  css: <FaHtml5 className="text-4xl text-orange-500" />,
  javascript: <FaHtml5 className="text-4xl text-orange-500" />,
  node: <FaNodeJs className="text-4xl text-green-600" />,
  java: <FaNodeJs className="text-4xl text-green-600" />,
  spring: <SiSpringboot className="text-4xl text-green-500" />,
  python: <FaPython className="text-4xl text-blue-600" />,
  "c#": <FaMicrosoft className="text-4xl text-purple-600" />,
  "c++": <FaMicrosoft className="text-4xl text-purple-600" />,
  bash: <FaNetworkWired className="text-4xl text-blue-500" />,
  ansible: <FaNetworkWired className="text-4xl text-blue-500" />,
  cisco: <FaNetworkWired className="text-4xl text-blue-500" />,
};

const getCoursesIcon = (courses: string): React.ReactNode => {
  const lowerLang = courses.toLowerCase();

  const matchedCourses = Object.keys(coursesIcons).find((key) =>
    lowerLang.includes(key)
  );

  return matchedCourses ? (
    coursesIcons[matchedCourses]
  ) : (
    <FaCode className="text-4xl text-gray-600" />
  );
};

const categoryColors: Record<string, string> = {
  "web development": "bg-blue-500",
  "software development": "bg-green-500",
  networking: "bg-orange-500",
  "mobile development": "bg-purple-500",
  "data science": "bg-indigo-500",
  devops: "bg-teal-500",
  "game development": "bg-pink-500",
};

const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();

  const matchedCategory = Object.keys(categoryColors).find((key) =>
    lowerCategory.includes(key)
  );

  return matchedCategory ? categoryColors[matchedCategory] : "bg-gray-500";
};

const CoursesCard = ({ category, language, tutors }: CardProps) => {
  const colorClass = getCategoryColor(category);

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center h-full flex flex-col">
      <div
        className={`${colorClass} text-white px-4 py-2 rounded-full inline-block mb-4 font-bold text-xs uppercase tracking-wide`}
      >
        {category}
      </div>

      <div className="mb-4 flex justify-center">{getCoursesIcon(language)}</div>

      <Link to="/courses" className="block mb-4">
        <h3 className="text-lg font-bold text-gray-800 leading-tight min-h-[4rem] flex items-center justify-center px-2">
          {language}
        </h3>
      </Link>

      <div className="flex items-center justify-center space-x-2 mb-4">
        <FaUsers className="text-blue-500 text-sm" />
        <p className="text-sm font-medium text-gray-600">
          <span className="text-lg font-bold text-blue-600">{tutors}</span>{" "}
          Active Tutors
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-auto">
        <div
          className={`${colorClass} h-2 rounded-full`}
          style={{ width: `${Math.min(tutors * 2, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CoursesCard;
