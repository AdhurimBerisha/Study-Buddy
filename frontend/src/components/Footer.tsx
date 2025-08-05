import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWeibo,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="text-gray-700 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-500">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Affiliate Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Education Partners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  We are Hiring!
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Become a Teacher
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Teachers</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Web Development - Front End
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Web Development - Back End
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Software Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Networking & Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Web Development - Front End
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Web Development - Back End
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Software Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Networking & Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <p className="mb-2">Need any Help?</p>
            <a href="mailto:contact@info.com" className="hover:text-blue-500">
              contact@info.com
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaFacebookF className="text-blue-500" />
                <a href="#" className="hover:text-blue-500">
                  Facebook
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaTwitter className="text-blue-500" />
                <a href="#" className="hover:text-blue-500">
                  Twitter
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaYoutube className="text-blue-500" />
                <a href="#" className="hover:text-blue-500">
                  YouTube
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaInstagram className="text-blue-500" />
                <a href="#" className="hover:text-blue-500">
                  Instagram
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaWeibo className="text-blue-500" />
                <a href="#" className="hover:text-blue-500">
                  Weibo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="mb-2">123-456-7890</p>
            <p>Rruga B, Pristina</p>
            <p>Pristina Kosovo, 10000</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
