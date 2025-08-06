import Hero from "../../components/Hero";
import HowItWorks from "./HowItWorks";
import LanguageGrid from "../../components/LanguageGrid";
import WhyUs from "./WhyUs";

const Home = () => {
  return (
    <div>
      <Hero />
      <LanguageGrid />
      <HowItWorks />
      <WhyUs />
    </div>
  );
};

export default Home;
