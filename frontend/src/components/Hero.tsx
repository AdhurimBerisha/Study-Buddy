import { useLocation } from "react-router-dom";
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
        <span className="underline decoration-blue-500">new career</span> today
        with the{" "}
        <span className="underline decoration-blue-500">
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
        <span className="underline decoration-blue-500">perfect course</span>{" "}
        and start learning today
      </>
    ),
  },
  "/tutors": {
    sub: "Find the best tutors",
    title: (
      <>
        Connect with{" "}
        <span className="underline decoration-blue-500">skilled tutors</span> to
        boost your learning
      </>
    ),
  },
  "/groups": {
    sub: "Join a study group",
    title: (
      <>
        Learn <span className="underline decoration-blue-500">with others</span>{" "}
        with peers around the world
      </>
    ),
  },
  "/groups/my-group": {
    sub: "Join a study group",
    title: (
      <>
        Learn <span className="underline decoration-blue-500">with others</span>{" "}
        with peers around the world
      </>
    ),
  },
  "/contact": {
    sub: "Need help or have questions?",
    title: (
      <>
        Get in touch with our{" "}
        <span className="underline decoration-blue-500">assistance team</span>
      </>
    ),
  },
  "/about": {
    sub: "Who we are",
    title: (
      <>
        Learn more about our{" "}
        <span className="underline decoration-blue-500">mission</span> and{" "}
        <span className="underline decoration-blue-500">vision</span>
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
      className="relative h-[90vh] flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-6">
        <p className="text-sm mb-2 ">{text.sub}</p>
        <h1 className="text-5xl  font-light leading-tight whitespace-pre-line">
          {text.title}
        </h1>
        <div className="mt-6 text-xl animate-bounce">↓</div>
      </div>
    </section>
  );
};

export default Hero;
