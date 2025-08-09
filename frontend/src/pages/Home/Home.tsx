import Hero from "../../components/Hero";
import HowItWorks from "./HowItWorks";
import CoursesGrid from "../Courses/CoursesGrid";
import { courses as allCourses } from "../Courses/data";
import WhyUs from "../../components/WhyUs";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";

const Home = () => {
  return (
    <div>
      <Hero />
      <CoursesGrid items={allCourses.slice(0, 4)} />
      <HowItWorks />
      <Features />
      <WhyUs />
      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        subtitle="Choose a teacher for 1-on-1 lessons"
        buttonText="Sign Up"
      />
    </div>
  );
};

export default Home;
