import howItWorks from "../../assets/howItWorks.webp";
import LazyImage from "../../components/LazyImage";

const steps = [
  {
    number: 1,
    title: "Browse Courses & Find Tutors",
    description:
      "Explore our curated selection of courses across various subjects and connect with verified, experienced tutors who specialize in your area of interest.",
  },
  {
    number: 2,
    title: "Join Study Groups & Start Learning",
    description:
      "Join collaborative study groups with peers worldwide, participate in interactive sessions, and practice coding with our real-time code editor.",
  },
  {
    number: 3,
    title: "Track Progress & Achieve Goals",
    description:
      "Monitor your learning journey with progress tracking, complete lessons at your own pace, and earn certificates as you master new skills.",
  },
];

const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 dark:border-gray-600 pb-8 mb-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            How it all works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            StudyBuddy makes online learning simple, interactive, and effective.
            Follow these three easy steps to begin your educational journey.
          </p>
          <div className="w-10 h-0.5 bg-gray-400 dark:bg-gray-500" />
        </div>

        <div className="relative">
          <LazyImage
            src={howItWorks}
            alt="Student using laptop"
            className="rounded-3xl shadow-lg"
          />
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="absolute left-full -ml-6"
              style={{ top: `${(idx + 1) * 100 - -43}px` }}
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shadow-md">
                {step.number}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
