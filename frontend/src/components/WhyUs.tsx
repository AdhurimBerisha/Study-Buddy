import { FaArrowRight } from "react-icons/fa6";
import Button from "../components/Button";

const WhyUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Left Column */}
        <div className="flex-1 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-light text-blue-600">
              Why Choose Us?
            </h2>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Learn programming online anywhere, anytime!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Experience the future of learning with our comprehensive online
              platform designed to help you master programming skills at your
              own pace.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Customized learning
              </h3>
              <p className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                <FaArrowRight className="mt-1 text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <span>
                  Personalized learning paths tailored to your skill level and
                  goals, ensuring you get the most out of every session.
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Get expert help when you need it
              </h3>
              <p className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                <FaArrowRight className="mt-1 text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <span>
                  Access to qualified tutors 24/7, ready to help you overcome
                  challenges and accelerate your learning journey.
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Learn anytime, Practice anywhere
              </h3>
              <p className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                <FaArrowRight className="mt-1 text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <span>
                  Flexible scheduling and mobile-friendly platform that fits
                  your lifestyle and learning preferences.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 p-0 lg:p-2">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-light text-blue-600">
              About Us
            </h2>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              "Our skilled tutors guide you every step of the way to help you
              reach your goals"
            </blockquote>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Join thousands of successful learners who have transformed their
              careers with our expert-led programming courses and personalized
              mentoring.
            </p>
            <div className="pt-2">
              <Button size="lg">Read More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
