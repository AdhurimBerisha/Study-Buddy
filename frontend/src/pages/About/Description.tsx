const AboutHero = () => {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-6 border-b border-gray-300">
      <div className="max-w-6xl mx-auto py-24 lg:py-20 text-center">
        <div className="text-blue-400 text-sm font-medium mb-6">About us</div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-black max-w-4xl mx-auto">
          We connect students and teachers
          <br />
          lorem ipsum dolor sit amet,
          <br />
          consectetur.
        </h1>

        <div className="mt-8 mb-10 flex justify-center">
          <span className="block w-20 h-[2px] bg-gray-400/50 rounded"></span>
        </div>

        <p className="max-w-3xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
          enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
          sed quia consequuntur magni dolores eos qui.
        </p>
      </div>

      <div className="border-t border-gray-200 mb-12"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 pb-24">
        <div>
          <div className="text-blue-400 text-sm mb-3">Our Vision</div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug max-w-sm">
            Consectetur adipisicing elit, sed do eiusmod tempor incididunt.
          </h3>
          <p className="text-gray-500 text-sm">
            A short supporting paragraph describing the vision in one or two
            sentences so readers understand the goal and why it matters.
          </p>
        </div>

        <div>
          <div className="text-blue-400 text-sm mb-3">Our Mission</div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug max-w-sm">
            Adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore.
          </h3>
          <p className="text-gray-500 text-sm">
            A short supporting paragraph describing the mission and the
            practical steps you take to achieve the vision. Keep it concise and
            focused.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
