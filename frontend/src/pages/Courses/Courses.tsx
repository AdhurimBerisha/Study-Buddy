import Features from "../../components/Features";
import Hero from "../../components/Hero";
import LanguageGrid from "../../components/CoursesGrid";

const Courses = () => {
  return (
    <div>
      <Hero />
      <LanguageGrid showExtras={false} />
      <Features />
    </div>
  );
};
export default Courses;
