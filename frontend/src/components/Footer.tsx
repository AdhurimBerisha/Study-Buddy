import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16">
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              About StudyBuddy
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  What we do
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/courses"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Browse courses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tutors"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Find a tutor
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/groups"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Join study groups
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Contact us
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              For Tutors
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <NavLink
                  to="/tutors"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Meet our tutors
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  How tutoring works
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/groups"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Join study groups
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Contact support
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Support
            </h3>
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-medium">Need any Help?</p>
              <a
                href="mailto:studybuddy@gmail.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
              >
                <FaEnvelope className="text-blue-400" />
                studybuddy@gmail.com
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Follow Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaFacebookF className="text-blue-400" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaTwitter className="text-blue-400" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaLinkedin className="text-blue-400" />
                  Linkedin
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaInstagram className="text-blue-400" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <FaPhone className="text-blue-400" />
                <span>+383 44 123 456</span>
              </div>
              <div className="flex items-start gap-2 text-sm sm:text-base">
                <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p>Rruga B, Pristina</p>
                  <p>Pristina Kosovo, 10000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 sm:mt-16 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm sm:text-base text-gray-400">
              © {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm sm:text-base">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
