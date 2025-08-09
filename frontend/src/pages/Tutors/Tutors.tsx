import Hero from "../../components/Hero";
import TutorsGrid from "./TutorsGrid";
import bannerBg from "../../assets/bannerBg.webp";
import Banner from "../../components/Banner";
import { useMemo, useState } from "react";
import { tutors as allTutors, type Tutor } from "./data";
import FilterBar from "../../components/FilterBar";
import Button from "../../components/Button";

const Tutors = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>(null);

  const filtered: Tutor[] = useMemo(() => {
    let list = allTutors.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (category) {
      const cat = category.toLowerCase();
      list = list.filter((t) => t.category.toLowerCase().includes(cat));
    }
    if (ratingSort) {
      list = list
        .slice()
        .sort((a, b) =>
          ratingSort === "asc" ? a.rating - b.rating : b.rating - a.rating
        );
    }
    return list;
  }, [query, category, ratingSort]);

  const visible = filtered.slice(0, visibleCount);
  const canShowMore = visibleCount < filtered.length;
  const canShowLess = visibleCount > 4;

  return (
    <div>
      <Hero />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={ratingSort}
        onSortChange={setRatingSort}
        searchPlaceholder="Search by tutor or category"
        sortLabel="Sort by rating"
        ascLabel="Lowest rated"
        descLabel="Highest rated"
        containerClassName="mt-6 mb-6"
      />
      <TutorsGrid
        items={visible}
        footer={
          canShowMore || canShowLess ? (
            <div className="flex justify-center gap-3">
              {canShowLess && (
                <Button onClick={() => setVisibleCount(4)}>Show less</Button>
              )}
              {canShowMore && (
                <Button onClick={() => setVisibleCount((c) => c + 4)}>
                  Show more
                </Button>
              )}
            </div>
          ) : null
        }
      />
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
