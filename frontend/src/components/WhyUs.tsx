import { FaArrowRight } from "react-icons/fa6";
import Button from "./Button";

const WhyUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Section - Why Choose Us */}
        <div className="flex-1 p-6">
          <h2 className="text-xl font-thin mb-2">Why Choose Us?</h2>
          <h1 className="text-2xl font-bold mt-6 mb-2">
            Learn programming online anywhere, anytime!
          </h1>
          <p className="mb-6">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi
            reiciendis voluptatibus eveniet ipsum quas mollitia ex alias,
            nostrum quo commodi.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">Customized learning</h2>
            <p className="flex items-start gap-2">
              <FaArrowRight className="mt-1 text-blue-600 text-2xl" />
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Perspiciatis vitae delectus accusamus dolore architecto? Corporis.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              Get expert help when you need it
            </h2>
            <p className="flex items-start gap-2">
              <FaArrowRight className="mt-1 text-blue-600 text-2xl" />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora
              neque vitae voluptatum pariatur aliquid maxime!
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              Learn anytime, Practice anywhere
            </h2>
            <p className="flex items-start gap-2">
              <FaArrowRight className="mt-1 text-blue-600 text-2xl" />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora
              neque vitae voluptatum pariatur aliquid maxime!
            </p>
          </div>
        </div>

        {/* Right Section - About Us */}
        <div className="flex-1 p-6 rounded-xl">
          <h2 className="text-xl font-thin mb-2">About Us</h2>
          <h1 className="text-5xl font-bold mt-4 mb-4">
            "We prepare you to achieve your goals with professional tutors."
          </h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
            officia possimus beatae aut alias omnis ipsum sit recusandae
            reprehenderit expedita.
          </p>
          <Button>Read More</Button>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
