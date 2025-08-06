import Hero from "../../components/Hero";
import HowItWorks from "./HowItWorks";
import CoursesGrid from "../Courses/CoursesGrid";
import WhyUs from "./WhyUs";
import Features from "../../components/Features";

const Home = () => {
  return (
    <div>
      <Hero />
      <CoursesGrid />
      <HowItWorks />
      <Features />
      <WhyUs />
    </div>
  );
};

export default Home;
