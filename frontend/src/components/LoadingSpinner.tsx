interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-blue-600 mb-4`}
      ></div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
