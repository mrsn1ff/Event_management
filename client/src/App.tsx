import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/user/LandingPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RegisterForm from "./pages/user/RegisterForm";
import EventRegistrationPage from "./pages/admin/RegistrationStatusPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/register/:id" element={<RegisterForm />} />
        <Route path="/registrations/event/:eventId" element={<EventRegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
