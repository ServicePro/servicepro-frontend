import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<h1>Services Page</h1>} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="/services" element={<h1>Services Page</h1>} />
        <Route path="/booking" element={<h1>Booking Page</h1>} />
        <Route path="/provider" element={<h1>Provider Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;