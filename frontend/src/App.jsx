import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage.jsx";
import CitizenDashboard from "./components/CitizenDashboard.jsx";
import OfficialDashboard from "./components/OfficialDashboard.jsx";
import IdentityUpload from "./components/IdentityUpload.jsx";
import ApplicationUpload from "./components/ApplicationUpload.jsx";
import About from "./components/About.jsx";
import ContactUs from "./components/ContactUs.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/official" element={<OfficialDashboard />} />
        <Route path="/identity-application" element={<IdentityUpload />} />
        {/* <Route path="/application" element={<ApplicationUpload />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}
