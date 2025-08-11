import Banner from "../../components/Banner";
import Hero from "../../components/Hero";
import ContactForm from "./ContactForm";
import bannerBg from "../../assets/bannerBg.webp";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 h-max">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact info</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">
                <FaEnvelope />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-500">
                  Email
                </div>
                <a
                  href="mailto:contact@info.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@info.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">
                <FaPhoneAlt />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-500">
                  Phone
                </div>
                <div>+1 (555) 123-4567</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">
                <FaMapMarkerAlt />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-500">
                  Office
                </div>
                <div>500 Learning Ave, Suite 200, San Francisco, CA</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">
                <FaClock />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-500">
                  Hours
                </div>
                <div>Mon–Fri: 9:00–18:00 (PST)</div>
              </div>
            </li>
          </ul>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Follow us
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-700 transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>

      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        subtitle="Choose a teacher for 1-on-1 lessons"
        buttonText="Sign Up"
      />
    </div>
  );
};
export default Contact;
