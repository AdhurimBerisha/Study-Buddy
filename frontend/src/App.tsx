import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import Groups from "./pages/Groups";
import Tutors from "./pages/Tutors";

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
