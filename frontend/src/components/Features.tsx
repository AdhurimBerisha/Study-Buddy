import {
  FaGraduationCap,
  FaUsers,
  FaDollarSign,
  FaUserCheck,
} from "react-icons/fa";

const features = [
  {
    icon: <FaGraduationCap />,
    title: "Expert Tutors",
    description:
      "Connect with qualified and experienced tutors who are experts in their fields and passionate about teaching.",
  },
  {
    icon: <FaUsers />,
    title: "Verified Profiles",
    description:
      "All our tutors undergo thorough verification processes to ensure quality and reliability for your learning journey.",
  },
  {
    icon: <FaUserCheck />,
    title: "Pay Per Lesson",
    description:
      "Flexible payment options - pay only for the lessons you take with no long-term commitments or hidden fees.",
  },
  {
    icon: <FaDollarSign />,
    title: "Affordable Prices",
    description:
      "Quality education at competitive prices, making learning accessible to everyone regardless of budget.",
  },
];

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="text-center mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Why Choose StudyBuddy?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
          Discover the advantages that make us the preferred choice for online
          learning
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-500 text-blue-500 flex items-center justify-center mb-4 sm:mb-6 text-xl sm:text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg">
              {feature.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
