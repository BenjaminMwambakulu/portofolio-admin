import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import HeroSection from "./Pages/HeroSection";
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage";
import AboutSection from "./Pages/AboutSection";
import SkillsSection from "./Pages/SkillsSection";
import ProjectsSection from "./Pages/ProjectsSection";
import DocumentsSection from "./Pages/DocumentsSection";
import ContactSection from "./Pages/ContactSection";

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
            <Route path="/skills" element={<SkillsSection />} />
            <Route path="/projects" element={<ProjectsSection />} />
            <Route path="/resume" element={<DocumentsSection />} />
            <Route path="/contact" element={<ContactSection />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}