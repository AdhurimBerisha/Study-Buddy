type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

const Button = ({
  children,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "p-3.5 rounded-3xl flex items-center gap-2 transition-all duration-300 font-semibold";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-400",
    outline:
      "bg-transparent border-2 border-blue-600 text-gray-700 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
