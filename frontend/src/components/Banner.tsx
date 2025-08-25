import Button from "./Button";
import LazyImage from "./LazyImage";
import { useNavigate } from "react-router-dom";

interface BannerProps {
  imageSrc: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "light" | "dark";
}

const Banner = ({
  imageSrc,
  title,
  subtitle,
  buttonText,
  buttonLink,
  variant = "dark",
}: BannerProps) => {
  const navigate = useNavigate();
  const overlayClass =
    variant === "dark" ? "bg-black bg-opacity-50" : "bg-white bg-opacity-20";
  const textClass = variant === "dark" ? "text-white" : "text-white";

  const handleButtonClick = () => {
    if (buttonLink) {
      window.open(buttonLink, "_blank");
    } else if (buttonText === "Sign Up") {
      navigate("/register");
    } else if (buttonText === "Browse Groups") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[650px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
          <LazyImage
            src={imageSrc}
            alt="Banner"
            className="w-full h-full object-cover absolute inset-0 z-0"
          />

          <div className={`absolute inset-0 ${overlayClass} z-10`} />

          <div
            className={`relative z-20 ${textClass} text-center flex flex-col items-center justify-center h-full p-4 sm:p-6 lg:p-8 xl:p-12`}
          >
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4 font-medium opacity-90">
                {subtitle}
              </p>
            )}
            {title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">
                {title}
              </h1>
            )}
            {buttonText && (
              <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-center">
                <Button
                  variant={variant === "dark" ? "primary" : "outline"}
                  size="lg"
                  onClick={handleButtonClick}
                >
                  {buttonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
