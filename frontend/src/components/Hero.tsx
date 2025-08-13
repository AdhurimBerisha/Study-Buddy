import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import bg from "../assets/bg.webp";
import coursesBg from "../assets/coursesBg.webp";
import groupsBg from "../assets/groupsBg.webp";
import contactBg from "../assets/contactBg.webp";
import aboutBg from "../assets/aboutBg.webp";
import tutorBg from "../assets/tutorBg.webp";

type RoutePath =
  | "/"
  | "/courses"
  | "/tutors"
  | "/groups"
  | "/groups/my-group"
  | "/contact"
  | "/about";

const backgroundMap: Record<RoutePath, string> = {
  "/": bg,
  "/courses": coursesBg,
  "/tutors": tutorBg,
  "/groups": groupsBg,
  "/groups/my-group": groupsBg,
  "/contact": contactBg,
  "/about": aboutBg,
};

const textMap: Record<RoutePath, { sub: string; title: React.ReactNode }> = {
  "/": {
    sub: "Looking to develop your future?",
    title: (
      <>
        Start your{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          new career
        </span>{" "}
        today with the{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          best online tutors
        </span>
        !
      </>
    ),
  },
  "/courses": {
    sub: "Browse through all our courses",
    title: (
      <>
        Find your{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          perfect course
        </span>{" "}
        and start learning today
      </>
    ),
  },
  "/tutors": {
    sub: "Find the best tutors",
    title: (
      <>
        Connect with{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          skilled tutors
        </span>{" "}
        to boost your learning
      </>
    ),
  },
  "/groups": {
    sub: "Join a study group",
    title: (
      <>
        Learn{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          with others
        </span>{" "}
        with peers around the world
      </>
    ),
  },
  "/groups/my-group": {
    sub: "Join a study group",
    title: (
      <>
        Learn{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          with others
        </span>{" "}
        with peers around the world
      </>
    ),
  },
  "/contact": {
    sub: "Need help or have questions?",
    title: (
      <>
        Get in touch with our{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          assistance team
        </span>
      </>
    ),
  },
  "/about": {
    sub: "Who we are",
    title: (
      <>
        Learn more about our{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          mission
        </span>{" "}
        and{" "}
        <span className="underline decoration-blue-500 decoration-2 underline-offset-4">
          vision
        </span>
      </>
    ),
  },
};

const Hero = () => {
  const location = useLocation();
  const route = location.pathname as RoutePath;
  const bgImage = backgroundMap[route] || bg;
  const text = textMap[route] || textMap["/"];

  return (
    <section
      className="relative min-h-[91vh] flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 font-medium text-gray-200">
          {text.sub}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight px-2 sm:px-4">
          {text.title}
        </h1>

        {route === "/" && (
          <div className="mt-6 sm:mt-8 lg:mt-10">
            <Link
              to="/code-editor"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Try Our Code Editor
            </Link>
            <p className="mt-3 text-sm text-gray-300">
              Practice coding with live preview • Multiple languages • No setup
              required
            </p>
          </div>
        )}

        <div className="mt-4 sm:mt-6 lg:mt-8 text-lg sm:text-xl lg:text-2xl animate-bounce">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
