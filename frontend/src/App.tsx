import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses/Courses";
import Groups from "./pages/Groups/Groups";
import MyGroup from "./pages/Groups/MyGroup";
import Tutors from "./pages/Tutors/Tutors";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 bg-[length:200%_200%] animate-gradient-x">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<MyGroup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
