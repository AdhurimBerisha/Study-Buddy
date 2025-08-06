import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-start text-sm py-4">
      <img className="ml-3 w-[200px] h-auto" src={Logo} alt="StudyBuddy" />

      <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-6 font-medium text-white">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Courses
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/tutors"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Tutors
          </NavLink>
        </li>

        <li className="relative group">
          <div className="cursor-pointer hover:text-blue-500 inline-block">
            Groups ▾
          </div>

          <ul className="absolute left-0 top-full w-40 bg-white text-black rounded-md shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <li>
              <NavLink
                to="/groups/study"
                className="block px-4 py-2 hover:bg-gray-100 w-full"
              >
                View All Groups
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups/language"
                className="block px-4 py-2 hover:bg-gray-100 w-full"
              >
                Your Group
              </NavLink>
            </li>
          </ul>
        </li>

        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
