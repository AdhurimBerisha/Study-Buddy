import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";
import { fetchProfile } from "./store/slice/authSlice";
import { lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatLayout from "./components/ChatLayout";
import PageLoadingSpinner from "./components/PageLoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./hooks/useTheme";
import { usePageTitle } from "./hooks/usePageTitle";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Courses = lazy(() => import("./pages/Courses/Courses"));
const CourseDetails = lazy(() => import("./pages/Courses/CourseDetails"));
const AllGroups = lazy(() => import("./pages/Groups/AllGroups"));
const MyGroup = lazy(() => import("./pages/Groups/MyGroup"));
const Tutors = lazy(() => import("./pages/Tutors/Tutors"));
const TutorDetails = lazy(() => import("./pages/Tutors/TutorDetails"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const MyProfile = lazy(() => import("./pages/Profile/MyProfile"));
const GroupDetails = lazy(() => import("./pages/Groups/GroupDetails"));
const ChatPage = lazy(() => import("./pages/Groups/ChatPage"));
const Checkout = lazy(() => import("./pages/Payments/Checkout"));
const MyLearning = lazy(() => import("./pages/Learning/MyLearning"));
const CourseReader = lazy(() => import("./pages/Learning/CourseReader"));
const CodeEditorDemo = lazy(
  () => import("./pages/CodeEditorDemo/CodeEditorDemo")
);
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const EmailVerification = lazy(
  () => import("./pages/EmailVerification/EmailVerification")
);

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const isAuthenticated = !!token;

  usePageTitle();

  const showChatLayout =
    location.pathname !== "/groups/chat" && isAuthenticated;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-[length:200%_200%] animate-gradient-x pt-20">
      <Navbar />
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutors/:id" element={<TutorDetails />} />
          <Route path="/groups" element={<AllGroups />} />
          <Route path="/groups/my" element={<MyGroup />} />
          <Route
            path="/groups/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/course/:slug"
            element={
              <ProtectedRoute>
                <CourseReader />
              </ProtectedRoute>
            }
          />
          <Route path="/code-editor" element={<CodeEditorDemo />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showChatLayout && <ChatLayout />}
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};

export default App;
