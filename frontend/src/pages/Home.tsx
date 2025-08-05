import Banner from "../components/Banner";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import LanguageGrid from "../components/LanguageGrid";
import WhyUs from "../components/WhyUs";

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
