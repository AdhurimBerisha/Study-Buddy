import { useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Logo from "../assets/Logo.svg";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Badge from "./Badge";
import ThemeToggle from "./ThemeToggle";
import { getDisplayName } from "../utils/nameUtils";
import { useRoutePreloader } from "../hooks/useRoutePreloader";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileGroupsDropdownOpen, setIsMobileGroupsDropdownOpen] =
    useState(false);
  const [isMobileCoursesDropdownOpen, setIsMobileCoursesDropdownOpen] =
    useState(false);
  const location = useLocation();
  const isGroupsActive = location.pathname.startsWith("/groups");
  const { preloadOnHover } = useRoutePreloader();

  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCountsByGroupId } = useSelector(
    (state: RootState) => state.chat
  );

  const totalUnreadCount = Object.values(unreadCountsByGroupId).reduce(
    (sum, count) => sum + count,
    0
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setIsMobileGroupsDropdownOpen(false);
    }
  };

  const toggleMobileGroupsDropdown = () => {
    setIsMobileGroupsDropdownOpen(!isMobileGroupsDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-md shadow-md z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="block">
              <img
                className="w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
                src={Logo}
                alt="StudyBuddy"
              />
            </NavLink>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => preloadOnHover("/")}
              >
                Home
              </NavLink>

              <div className="relative group">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    location.pathname.startsWith("/courses")
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                  onMouseEnter={() => preloadOnHover("/courses")}
                >
                  Courses
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <NavLink
                      to="/courses"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onMouseEnter={() => preloadOnHover("/courses")}
                    >
                      All Courses
                    </NavLink>
                    <NavLink
                      to="/learning"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onMouseEnter={() => preloadOnHover("/learning")}
                    >
                      My Learning
                    </NavLink>
                  </div>
                </div>
              </div>

              <NavLink
                to="/tutors"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => preloadOnHover("/tutors")}
              >
                Tutors
              </NavLink>

              <div className="relative group">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    isGroupsActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                  onMouseEnter={() => preloadOnHover("/groups")}
                >
                  Groups
                  {totalUnreadCount > 0 && (
                    <Badge
                      count={totalUnreadCount}
                      variant="danger"
                      size="xs"
                      className="ml-2"
                    />
                  )}
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <NavLink
                      to="/groups"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      View All Groups
                    </NavLink>
                    <NavLink
                      to="/groups/my"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Your Groups
                    </NavLink>
                    <NavLink
                      to="/groups/chat"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span>Chat</span>
                        {totalUnreadCount > 0 && (
                          <Badge
                            count={totalUnreadCount}
                            variant="danger"
                            size="xs"
                          />
                        )}
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>

              <NavLink
                to="/code-editor"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => preloadOnHover("/code-editor")}
              >
                Code Editor
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => preloadOnHover("/about")}
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                  }`
                }
                onMouseEnter={() => preloadOnHover("/contact")}
              >
                Contact
              </NavLink>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="hidden sm:block">
                      {getDisplayName(user?.firstName || "", user?.lastName)}
                    </span>
                    <svg
                      className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {(user?.role === "admin" || user?.role === "tutor") && (
                        <NavLink
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:text-blue-400 transition-colors duration-200"
                          onMouseEnter={() => preloadOnHover("/dashboard")}
                        >
                          Dashboard
                        </NavLink>
                      )}
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onMouseEnter={() => preloadOnHover("/profile")}
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    onMouseEnter={() => preloadOnHover("/login")}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors duration-200"
                    onMouseEnter={() => preloadOnHover("/register")}
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 backdrop-blur-sm">
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
            <NavLink
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`
              }
            >
              Home
            </NavLink>

            <div className="relative">
              <button
                onClick={() => setIsMobileCoursesDropdownOpen((v) => !v)}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between ${
                  location.pathname.startsWith("/courses") ||
                  location.pathname.startsWith("/learning")
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`}
              >
                <span>Courses</span>
                {isMobileCoursesDropdownOpen ? (
                  <FaChevronUp className="h-4 w-4" />
                ) : (
                  <FaChevronDown className="h-4 w-4" />
                )}
              </button>
              {isMobileCoursesDropdownOpen && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-600 pl-4">
                  <NavLink
                    to="/courses"
                    onClick={() => {
                      toggleMenu();
                      setIsMobileCoursesDropdownOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-white hover:text-blue-300"
                      }`
                    }
                  >
                    All Courses
                  </NavLink>
                  <NavLink
                    to="/learning"
                    onClick={() => {
                      toggleMenu();
                      setIsMobileCoursesDropdownOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-white hover:text-blue-300"
                      }`
                    }
                  >
                    My Learning
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/tutors"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`
              }
            >
              Tutors
            </NavLink>

            <div className="relative">
              <button
                onClick={toggleMobileGroupsDropdown}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between ${
                  isGroupsActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`}
              >
                <div className="flex items-center">
                  <span>Groups</span>
                  {totalUnreadCount > 0 && (
                    <Badge
                      count={totalUnreadCount}
                      variant="danger"
                      size="xs"
                      className="ml-2"
                    />
                  )}
                </div>
                {isMobileGroupsDropdownOpen ? (
                  <FaChevronUp className="h-4 w-4" />
                ) : (
                  <FaChevronDown className="h-4 w-4" />
                )}
              </button>
              {isMobileGroupsDropdownOpen && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-600 pl-4">
                  <NavLink
                    to="/groups"
                    onClick={() => {
                      toggleMenu();
                      setIsMobileGroupsDropdownOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-white hover:text-blue-300"
                      }`
                    }
                  >
                    View All Groups
                  </NavLink>
                  <NavLink
                    to="/groups/my"
                    onClick={() => {
                      toggleMenu();
                      setIsMobileGroupsDropdownOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-white hover:text-blue-300"
                      }`
                    }
                  >
                    Your Groups
                  </NavLink>
                  <NavLink
                    to="/groups/chat"
                    onClick={() => {
                      toggleMenu();
                      setIsMobileGroupsDropdownOpen(false);
                    }}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-white hover:text-blue-300"
                      }`
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>Chat</span>
                      {totalUnreadCount > 0 && (
                        <Badge
                          count={totalUnreadCount}
                          variant="danger"
                          size="xs"
                        />
                      )}
                    </div>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/code-editor"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`
              }
            >
              Code Editor
            </NavLink>

            <NavLink
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }`
              }
            >
              Contact
            </NavLink>

            <div className="pt-4 pb-3 border-t border-gray-600">
              <div className="flex flex-col items-center space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 text-white">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}
                      <div className="text-sm">
                        <p className="font-medium">
                          {getDisplayName(
                            user?.firstName || "",
                            user?.lastName
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 w-full">
                      {(user?.role === "admin" || user?.role === "tutor") && (
                        <NavLink
                          to="/dashboard"
                          onClick={toggleMenu}
                          className="w-full text-center px-3 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors duration-200"
                        >
                          Dashboard
                        </NavLink>
                      )}
                      <NavLink
                        to="/profile"
                        onClick={toggleMenu}
                        className="w-full text-center px-3 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors duration-200"
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          toggleMenu();
                        }}
                        className="w-full text-center px-3 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-3 w-full">
                    <NavLink
                      to="/login"
                      onClick={toggleMenu}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors duration-200"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={toggleMenu}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors duration-200"
                    >
                      Sign Up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
