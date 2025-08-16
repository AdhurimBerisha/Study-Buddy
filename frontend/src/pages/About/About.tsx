import Banner from "../../components/Banner";
import Hero from "../../components/Hero";
import Description from "./Description";
import bannerBg from "../../assets/bannerBg.webp";
import descriptionBg from "../../assets/descriptionBg.webp";
import WhyUs from "../../components/WhyUs";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const About = () => {
  useCustomPageTitle("About Us");

  return (
    <div>
      <Hero />
      <Description />
      <Banner imageSrc={descriptionBg} />
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
export default About;
