import Hero from "../../components/Hero";
import HowItWorks from "./HowItWorks";
import LanguageGrid from "../../components/CoursesGrid";
import WhyUs from "./WhyUs";
import Features from "../../components/Features";

const Home = () => {
  return (
    <div>
      <Hero />
      <LanguageGrid />
      <HowItWorks />
      <Features />
      <WhyUs />
    </div>
  );
};

export default Home;
