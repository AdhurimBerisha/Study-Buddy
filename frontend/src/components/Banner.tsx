import bannerImage from "../assets/bannerBg.webp";
import Button from "./Button";

const Banner = () => {
  return (
    <div className="px-6 py-14">
      <div className="max-w-7xl mx-auto border-b border-gray-300 pb-8 mb-8">
        <div className="relative w-full min-h-[650px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover absolute inset-0 z-0"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

          <div className="relative z-20 text-white text-center py-52 px-8">
            <p className="text-sm mb-4">Choose a teacher for 1-on-1 lessons</p>
            <h1 className="text-4xl sm:text-5xl font-light leading-tight">
              <span className="font-thin">Start</span> learning a new language{" "}
              <br />
              <span className="font-thin">today!</span>
            </h1>
            <div className="mt-8 flex justify-center">
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
