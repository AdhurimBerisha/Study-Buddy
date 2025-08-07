import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../assets/Logo.svg";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { logout } from "../store/slice/authSlice";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.currentUser);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch<AppDispatch>();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="absolute top-0 left-0 w-full z-20 flex items-center tracking-wide justify-between text-sm py-4 px-3">
      <a href="/">
        <img
          className="w-[150px] md:w-[200px] h-auto"
          src={Logo}
          alt="StudyBuddy"
        />
      </a>

      <ul className="hidden lg:flex gap-6 font-medium text-white ">
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
                to="/groups"
                className="block px-4 py-2 hover:bg-gray-100 w-full"
              >
                View All Groups
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups/my"
                className="block px-4 py-2 hover:bg-gray-100 w-full"
              >
                Your Groups
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

      <div className="hidden lg:flex items-center gap-3 text-white">
        {isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm hover:text-blue-400 focus:outline-none">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
              <span>
                {user?.firstName} {user?.lastName} ▾
              </span>
            </button>

            <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <li>
                <NavLink
                  to={`/profile/${user?.id}`}
                  className="block px-4 py-2 hover:bg-gray-100 w-full"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => dispatch(logout())}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <NavLink
              to="/login"
              className="px-4 py-2 hover:text-blue-200 transition-colors duration-200"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all duration-200 font-medium"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      <button
        onClick={toggleMenu}
        className="lg:hidden text-white text-xl p-2"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black bg-opacity-90 backdrop-blur-sm lg:hidden">
          <ul className="flex flex-col items-center py-6 space-y-4 text-white font-medium">
            <li>
              <NavLink
                to="/"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courses"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutors"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Tutors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Groups
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="pt-4 border-t border-gray-600 w-full text-center">
              <div className="flex flex-col items-center space-y-3">
                <NavLink
                  to="/login"
                  onClick={toggleMenu}
                  className="px-4 py-2 text-white hover:text-blue-200 transition-colors duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={toggleMenu}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all duration-200 font-medium"
                >
                  Sign Up
                </NavLink>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
