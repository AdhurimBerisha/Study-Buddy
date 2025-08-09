import { useMemo } from "react";
import Button from "./Button";
import { courses } from "../pages/Courses/data";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  category: string | null;
  onCategoryChange: (v: string | null) => void;
  priceSort: "asc" | "desc" | null;
  onPriceSortChange: (v: "asc" | "desc" | null) => void;
};

const FilterBar = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  priceSort,
  onPriceSortChange,
}: Props) => {
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 mb-6">
      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by course or category"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category ?? ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by price
            </label>
            <select
              value={priceSort ?? ""}
              onChange={(e) =>
                onPriceSortChange(
                  (e.target.value as "asc" | "desc" | "") || null
                )
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">None</option>
              <option value="asc">Lowest first</option>
              <option value="desc">Highest first</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                onQueryChange("");
                onCategoryChange(null);
                onPriceSortChange(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
