import Hero from "../../components/Hero";
import HowItWorks from "./HowItWorks";
import CoursesGrid from "../Courses/CoursesGrid";
import WhyUs from "../../components/WhyUs";
import Features from "../../components/Features";
import Banner from "../../components/Banner";
import bannerBg from "../../assets/bannerBg.webp";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchCourses } from "../../store/slice/coursesSlice";
import CodeEditorSection from "./CodeEditorSection";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <div className="pt-8">
        <CoursesGrid items={loading ? [] : courses.slice(0, 4)} />
      </div>
      <HowItWorks />
      <CodeEditorSection />
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
