import { Link } from "react-router-dom";
import {
  FaHtml5,
  FaNodeJs,
  FaPython,
  FaMicrosoft,
  FaNetworkWired,
  FaCode,
  FaUsers,
  FaDollarSign,
  FaGraduationCap,
} from "react-icons/fa";
import { SiSpringboot } from "react-icons/si";
import Button from "../../components/Button";
import type { Course } from "../../store/slice/coursesSlice";

type CardProps = Course;

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

const CoursesCard = (course: CardProps) => {
  const {
    id,
    title,
    category,
    language,
    level,
    price,
    thumbnail,
    instructor,
    enrollmentCount = 0,
    isEnrolled = false,
    totalLessons,
  } = course;

  const colorClass = getCategoryColor(category);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-6 text-center h-full flex flex-col">
      {thumbnail && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      <div
        className={`${colorClass} text-white px-4 py-2 rounded-full inline-block mb-4 font-bold text-xs uppercase tracking-wide`}
      >
        {category}
      </div>

      <div className="mb-4 flex justify-center">{getCoursesIcon(language)}</div>

      <Link to={`/courses/${id}`} className="block mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight min-h-[4rem] flex items-center justify-center px-2">
          {title}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {language}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <FaUsers className="text-blue-500 text-sm" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {enrollmentCount}
            </span>{" "}
            Students
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <FaGraduationCap className="text-green-500 text-sm" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
            {level} Level
          </p>
        </div>

        {totalLessons && (
          <div className="flex items-center justify-center space-x-2">
            <FaCode className="text-purple-500 text-sm" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {totalLessons} Lessons
            </p>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2">
          <FaDollarSign className="text-yellow-500 text-sm" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${price}
            </span>
          </p>
        </div>
      </div>

      {instructor && (
        <div className="text-center mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Tutor:</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {instructor.firstName} {instructor.lastName}
          </p>
        </div>
      )}

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-auto mb-4">
        <div
          className={`${colorClass} h-2 rounded-full`}
          style={{ width: `${Math.min(enrollmentCount * 2, 100)}%` }}
        ></div>
      </div>

      <Link to={`/courses/${id}`} className="mt-auto">
        <Button fullWidth size="sm">
          {isEnrolled ? "Continue Learning" : "View Details"}
        </Button>
      </Link>
    </div>
  );
};

export default CoursesCard;
