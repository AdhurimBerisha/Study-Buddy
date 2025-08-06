import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses/Courses";
import Groups from "./pages/Groups";
import Tutors from "./pages/Tutors/Tutors";
import Footer from "./components/Footer";
import Banner from "./components/Banner";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-blue-100 bg-[length:200%_200%] animate-gradient-x">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Banner />
      <Footer />
    </div>
  );
}

export default App;
