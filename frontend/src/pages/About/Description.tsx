const AboutHero = () => {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-6 border-b border-gray-300 dark:border-gray-600">
      <div className="max-w-6xl mx-auto py-24 lg:py-20 text-center">
        <div className="text-blue-400 dark:text-blue-300 text-sm font-medium mb-6">
          About us
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-black dark:text-white max-w-4xl mx-auto">
          We connect students and teachers
          <br />
          in a modern learning environment
          <br />
          that empowers growth.
        </h1>

        <div className="mt-8 mb-10 flex justify-center">
          <span className="block w-20 h-[2px] bg-gray-400/50 dark:bg-gray-500/50 rounded"></span>
        </div>

        <p className="max-w-3xl mx-auto text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          StudyBuddy is a comprehensive online learning platform designed to
          bridge the gap between students seeking knowledge and experienced
          tutors passionate about teaching. We believe that quality education
          should be accessible, interactive, and personalized to meet individual
          learning needs. Our platform combines cutting-edge technology with
          proven educational methodologies to create an engaging learning
          experience.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 mb-12"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 pb-24">
        <div>
          <div className="text-blue-400 dark:text-blue-300 text-sm mb-3">
            Our Vision
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug max-w-sm text-black dark:text-white">
            To democratize education by making quality learning accessible to
            everyone, everywhere.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            We envision a world where geographical boundaries don't limit
            educational opportunities, and every student can connect with the
            perfect tutor to achieve their learning goals.
          </p>
        </div>

        <div>
          <div className="text-blue-400 dark:text-blue-300 text-sm mb-3">
            Our Mission
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug max-w-sm text-black dark:text-white">
            To provide innovative learning tools and connect learners with
            expert tutors through technology.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            We're committed to building the most effective online learning
            ecosystem, combining interactive features like our code editor,
            study groups, and personalized tutoring to create meaningful
            learning experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
