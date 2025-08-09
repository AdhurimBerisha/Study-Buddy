import Banner from "../../components/Banner";
import Features from "../../components/Features";
import Hero from "../../components/Hero";
import CoursesGrid from "./CoursesGrid";
import Button from "../../components/Button";
import { useMemo, useState } from "react";
import { courses as allCourses, type Course } from "./data";
import FilterBar from "../../components/FilterBar";
import bannerBg from "../../assets/bannerBg.webp";

const Courses = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const filtered: Course[] = useMemo(() => {
    let list = allCourses.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.language.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
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
  }, [query, category, priceSort]);

  const visible = filtered.slice(0, visibleCount);
  const canShowMore = visibleCount < filtered.length;
  const canShowLess = visibleCount > 8;

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
        searchPlaceholder="Search by course or category"
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
                <Button onClick={() => setVisibleCount(8)}>Show less</Button>
              )}
              {canShowMore && (
                <Button onClick={() => setVisibleCount((c) => c + 8)}>
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
