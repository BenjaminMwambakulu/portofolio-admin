import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import HeroSection from "./Pages/HeroSection";
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage";
import AboutSection from "./Pages/AboutSection";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Routes would be defined here */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hero" element={<HeroSection />} />
            <Route path="/about" element={<AboutSection />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}