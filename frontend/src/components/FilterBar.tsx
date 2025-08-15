import { useMemo } from "react";
import Button from "./Button";
import { courses } from "../pages/Courses/data";

type SortOrder = "asc" | "desc" | null;

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  category: string | null;
  onCategoryChange: (v: string | null) => void;
  sort: SortOrder;
  onSortChange: (v: SortOrder) => void;
  categories?: string[];
  searchPlaceholder?: string;
  sortLabel?: string;
  ascLabel?: string;
  descLabel?: string;
  containerClassName?: string;
};

const FilterBar = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories: providedCategories,
  searchPlaceholder = "Search",
  sortLabel = "Sort",
  ascLabel = "Ascending",
  descLabel = "Descending",
  containerClassName,
}: Props) => {
  const categories = useMemo(() => {
    if (providedCategories && providedCategories.length > 0) {
      return Array.from(new Set(providedCategories)).sort();
    }
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return Array.from(set).sort();
  }, [providedCategories]);

  const containerClasses = containerClassName || "-mt-24 mb-6";

  return (
    <div className={`max-w-7xl mx-auto px-6 relative z-20 ${containerClasses}`}>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category ?? ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {sortLabel}
            </label>
            <select
              value={sort ?? ""}
              onChange={(e) =>
                onSortChange((e.target.value as "asc" | "desc" | "") || null)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">None</option>
              <option value="asc">{ascLabel}</option>
              <option value="desc">{descLabel}</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                onQueryChange("");
                onCategoryChange(null);
                onSortChange(null);
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
