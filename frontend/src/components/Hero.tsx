import bg from "../assets/codingBackground.webp";

const Hero = () => {
  return (
    <section
      className="relative h-[90vh] flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 px-6">
        <p className="text-sm mb-2">In look for a language tutor?</p>
        <h1 className="text-5xl font-light leading-tight">
          Start <span className="font-bold underline">learning</span> a new{" "}
          <br />
          language today{" "}
          <span className="font-bold underline">with the best</span>
          <br />
          online tutors!
        </h1>
        <div className="mt-6 text-xl animate-bounce">↓</div>
      </div>
    </section>
  );
};

export default Hero;
