import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/Courses/CourseDetails";
import AllGroups from "./pages/Groups/AllGroups";
import MyGroup from "./pages/Groups/MyGroup";
import Tutors from "./pages/Tutors/Tutors";
import TutorDetails from "./pages/Tutors/TutorDetails";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound/NotFound";
import MyProfile from "./pages/Profile/MyProfile";
import GroupDetails from "./pages/Groups/GroupDetails";
import ChatLayout from "./components/ChatLayout";
import ChatPage from "./pages/Groups/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Payments/Checkout";
import MyLearning from "./pages/Learning/MyLearning";
import CourseReader from "./pages/Learning/CourseReader";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const showChatLayout =
    location.pathname !== "/groups/chat" && isAuthenticated;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 bg-[length:200%_200%] animate-gradient-x pt-20">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:slug" element={<TutorDetails />} />
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
        <Route path="/profile/:userId" element={<MyProfile />} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showChatLayout && <ChatLayout />}
      <Footer />
    </div>
  );
}

export default App;
