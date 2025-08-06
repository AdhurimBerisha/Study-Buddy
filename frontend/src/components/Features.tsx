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
      "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    icon: <FaUsers />,
    title: "Verified Profiles",
    description:
      "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    icon: <FaUserCheck />,
    title: "Pay Per Lesson",
    description:
      "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    icon: <FaDollarSign />,
    title: "Affordable Prices",
    description:
      "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
];

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8">
      <div className="mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 text-blue-500 flex items-center justify-center mb-4 text-xl">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
