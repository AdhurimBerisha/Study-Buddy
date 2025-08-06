type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "px-10 py-3 rounded-3xl flex items-center gap-2 transition-all duration-300 font-semibold";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-400",
    outline:
      "bg-transparent border-2 border-blue-600 text-gray-700 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
