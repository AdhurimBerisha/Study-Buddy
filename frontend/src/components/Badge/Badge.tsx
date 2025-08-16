interface BadgeProps {
  count: number;
  variant?: "primary" | "secondary" | "danger" | "warning";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const Badge = ({
  count,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) => {
  if (count === 0) {
    return null;
  }

  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-full";

  const variantClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  const sizeClasses = {
    xs: "text-[8px] px-1 py-0.5 min-w-[14px] h-3.5 leading-none",
    sm: "text-[10px] px-1.5 py-0.5 min-w-[16px] h-4 leading-none",
    md: "text-xs px-2 py-1 min-w-[18px] h-5 leading-none",
    lg: "text-sm px-2.5 py-1.5 min-w-[20px] h-6 leading-none",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default Badge;
