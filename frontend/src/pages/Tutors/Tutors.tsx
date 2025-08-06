import Hero from "../../components/Hero";
import TutorsGrid from "./TutorsGrid";
import bannerBg from "../../assets/bannerBg.webp";
import Banner from "../../components/Banner";

const Tutors = () => {
  return (
    <div>
      <Hero />
      <TutorsGrid />
      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        subtitle="Choose a teacher for 1-on-1 lessons"
        buttonText="Sign Up"
      />
    </div>
  );
};
export default Tutors;
