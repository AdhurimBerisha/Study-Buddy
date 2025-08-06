import Features from "../../components/Features";
import Hero from "../../components/Hero";
import CoursesGrid from "./CoursesGrid";

const Courses = () => {
  return (
    <div>
      <Hero />
      <CoursesGrid showExtras={false} />
      <Features />
    </div>
  );
};
export default Courses;
