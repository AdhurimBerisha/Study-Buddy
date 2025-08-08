import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWeibo,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              About Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Affiliate Program
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Education Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  We are Hiring!
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Become a Teacher
                </a>
              </li>
            </ul>
          </div>

          {/* Teachers */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Teachers
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Web Development - Front End
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Web Development - Back End
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Software Development
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Networking & Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Data Science
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Mobile Development
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Support
            </h3>
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-medium">Need any Help?</p>
              <a
                href="mailto:contact@studybuddy.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
              >
                <FaEnvelope className="text-blue-400" />
                contact@studybuddy.com
              </a>
            </div>
          </div>

          {/* Follow Us */}
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
                  <FaYoutube className="text-blue-400" />
                  YouTube
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
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaWeibo className="text-blue-400" />
                  Weibo
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <FaPhone className="text-blue-400" />
                <span>123-456-7890</span>
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

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 sm:mt-16 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm sm:text-base text-gray-400">
              © 2024 StudyBuddy. All rights reserved.
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
