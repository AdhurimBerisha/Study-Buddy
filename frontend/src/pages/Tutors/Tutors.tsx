import Hero from "../../components/Hero";
import TutorsGrid from "./TutorsGrid";
import bannerBg from "../../assets/bannerBg.webp";
import Banner from "../../components/Banner";
import { useEffect, useMemo, useState } from "react";
import { tutorAPI } from "../../services/api";
import { type Tutor } from "../../types/tutor";
import FilterBar from "../../components/FilterBar";
import Button from "../../components/Button";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const Tutors = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useCustomPageTitle("Find Tutors");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (category) params.category = category;

        const response = await tutorAPI.getAllTutors(params);
        setTutors(response.data.tutors);
      } catch (err) {
        setError("Failed to fetch tutors");
        console.error("Error fetching tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [category]);

  const filtered: Tutor[] = useMemo(() => {
    let list = tutors.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
          t.expertise.some((exp) => exp.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tutors, query]);

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
        searchPlaceholder="Search by tutor or category"
        containerClassName="mt-6 mb-6"
      />
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading tutors...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
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
      )}
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
