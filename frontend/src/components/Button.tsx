type ButtonProps = {
  children: React.ReactNode;
};

const Button = ({ children }: ButtonProps) => {
  return (
    <button className="bg-blue-600 text-white p-3 rounded-xl  hover:bg-blue-400 flex items-center gap-2">
      {children}
    </button>
  );
};
export default Button;
