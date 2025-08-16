import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

interface DarkModeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DarkModeToggle = ({
  className = "",
  size = "md",
}: DarkModeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${sizeClasses[size]} p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FaMoon className={iconSizes[size]} />
      ) : (
        <FaSun className={iconSizes[size]} />
      )}
    </button>
  );
};

export default DarkModeToggle;
