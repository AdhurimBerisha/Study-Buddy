import Button from "../../components/Button";
import LanguageCard from "./CoursesCard";
import { FaPlus, FaUsers, FaClock, FaStar } from "react-icons/fa";

const courses = [
  {
    category: "Web Development - Front End",
    language: "HTML/CSS/Javascript",
    tutors: 20,
  },
  {
    category: "Web Development - Back End",
    language: "Node.JS/Java/SpringBoot",
    tutors: 10,
  },
  { category: "Software Development", language: "Python/C#/C++", tutors: 30 },
  {
    category: "Networking & Security",
    language: "Python, Bash, Cisco Tools",
    tutors: 17,
  },
  {
    category: "Mobile Development",
    language: "React Native/Flutter",
    tutors: 15,
  },
  {
    category: "Data Science",
    language: "Python, R, SQL, Machine Learning",
    tutors: 25,
  },
  {
    category: "DevOps & Cloud",
    language: "Docker, Kubernetes, AWS, Azure",
    tutors: 12,
  },
  {
    category: "Game Development",
    language: "Unity, C#, Unreal Engine",
    tutors: 8,
  },
];

type CoursesGridProps = {
  showExtras?: boolean;
};

const CoursesGrid = ({ showExtras = true }: CoursesGridProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 -mt-20 pt-8 relative z-10">
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-gray-50 rounded-3xl"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-8 rounded-3xl shadow-lg bg-white relative">
          {courses.map((lang, index) => (
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
    </section>
  );
};

export default CoursesGrid;
