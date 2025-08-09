import Button from "../../components/Button";
import LanguageCard from "./CoursesCard";
import { FaPlus, FaUsers, FaClock, FaStar } from "react-icons/fa";
import { courses as allCourses } from "./data";
import type { Course } from "./data";

type CoursesGridProps = {
  showExtras?: boolean;
  items?: Course[];
  footer?: React.ReactNode;
};

const CoursesGrid = ({
  showExtras = true,
  items,
  footer,
}: CoursesGridProps) => {
  const list = items && items.length > 0 ? items : allCourses;
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 -mt-20 pt-8 relative z-10">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-gray-50 rounded-3xl"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-8 rounded-3xl shadow-lg bg-white relative">
          {list.map((lang, index) => (
            <div key={`${lang.category}-${index}`}>
              <LanguageCard {...lang} />
            </div>
          ))}
        </div>
      </div>

      {showExtras && (
        <>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <FaUsers className="text-blue-600 text-xl" />
              <span className="text-gray-700 font-semibold">
                150+ Active Tutors
              </span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <FaStar className="text-yellow-500 text-xl" />
              <span className="text-gray-700 font-semibold">
                8 Learning Paths
              </span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <FaClock className="text-green-500 text-xl" />
              <span className="text-gray-700 font-semibold">24/7 Support</span>
            </div>
          </div>

          <div className="flex flex-col items-center mt-16 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>
                <FaPlus className="mr-2" />
                Explore All Courses
              </Button>
              <Button variant="outline">
                <FaUsers className="text-sm" />
                Meet Our Tutors
              </Button>
            </div>
          </div>
        </>
      )}
      {footer && (
        <div className="mt-4 flex justify-center items-center">{footer}</div>
      )}
    </section>
  );
};

export default CoursesGrid;
