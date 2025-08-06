import howItWorks from "../../assets/howItWorks.webp";

const steps = [
  {
    number: 1,
    title: "Find the perfect tutor",
    description:
      "Elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Nam varius consectetur.",
  },
  {
    number: 2,
    title: "Schedule your lesson",
    description:
      "Elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Nam varius elementum.",
  },
  {
    number: 3,
    title: "Start the journey",
    description:
      "Elit tellus, luctus nec mattis, pulvinar dapibus leo. Nam varius consectetur elementum.",
  },
];

const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-300 pb-8 mb-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">How it all works</h2>
          <p className="text-gray-600 mb-6">
            Donec sagittis sagittis vestibulum. Morbi vestibulum neque.
          </p>
          <div className="w-10 h-0.5 bg-gray-400" />
        </div>

        <div className="relative">
          <img
            src={howItWorks}
            alt="Student using laptop"
            className="rounded-3xl shadow-lg"
          />
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="absolute left-full -ml-6"
              style={{ top: `${(idx + 1) * 100 - -43}px` }}
            >
              <div className="w-12 h-12 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center text-blue-600 font-bold text-xl shadow-md">
                {step.number}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number}>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
