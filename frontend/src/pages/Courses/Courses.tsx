import Banner from "../../components/Banner";
import Features from "../../components/Features";
import Hero from "../../components/Hero";
import CoursesGrid from "./CoursesGrid";
import Button from "../../components/Button";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchCourses } from "../../store/slice/coursesSlice";
import FilterBar from "../../components/FilterBar";
import bannerBg from "../../assets/bannerBg.webp";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const Courses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error, filters } = useSelector(
    (state: RootState) => state.courses
  );

  const [visibleCount, setVisibleCount] = useState(8);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  useCustomPageTitle("All Courses");

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const filtered = useMemo(() => {
    let list = [...courses];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.language.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
      );
    }

    if (category) {
      const cat = category.toLowerCase();
      list = list.filter((c) => c.category.toLowerCase().includes(cat));
    }

    if (priceSort) {
      list = list
        .slice()
        .sort((a, b) =>
          priceSort === "asc" ? a.price - b.price : b.price - a.price
        );
    }

    return list;
  }, [courses, query, category, priceSort]);

  const visible = filtered.slice(0, visibleCount);
  const canShowMore = visibleCount < filtered.length;
  const canShowLess = visibleCount > 8;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading courses: {error}
          </p>
          <Button
            onClick={() => {
              dispatch(fetchCourses(filters));
              toast.info("Retrying to load courses...");
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={priceSort}
        onSortChange={setPriceSort}
        searchPlaceholder="Search by course, category, or title"
        sortLabel="Sort by price"
        ascLabel="Lowest first"
        descLabel="Highest first"
        containerClassName="mt-6 mb-6"
      />
      <CoursesGrid
        showExtras={false}
        items={visible}
        footer={
          canShowMore || canShowLess ? (
            <div className="flex justify-center gap-3">
              {canShowLess && (
                <Button
                  onClick={() => {
                    setVisibleCount(8);
                    toast.info("Showing fewer courses");
                  }}
                >
                  Show less
                </Button>
              )}
              {canShowMore && (
                <Button
                  onClick={() => {
                    setVisibleCount((c) => c + 8);
                    toast.info("Showing more courses");
                  }}
                >
                  Show more
                </Button>
              )}
            </div>
          ) : null
        }
      />
      <Features />
      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        subtitle="Choose a teacher for 1-on-1 lessons"
        buttonText="Sign Up"
      />
    </div>
  );
};
export default Courses;
