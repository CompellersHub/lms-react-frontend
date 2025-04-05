import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { WhatsAppButton } from "./components/WhatsAppButton";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupUp";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="get-started" element={<CoursesPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <WhatsAppButton />
      </Router>
    </>
  );
}

export default App;
