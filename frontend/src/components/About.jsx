import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function About() {
  return (
    <div className="container fullscreen">
      <div className="header">
        <h2>About Sahayak AI</h2>
        <Link to="/"><button>Logout</button></Link>
      </div>

      <p>
        Sahayak AI is a digital platform designed to help citizens submit official documents
        and track their approval status efficiently. The system provides real-time ETA for submissions,
        color-coded status updates, and allows officials to manage submissions seamlessly.
      </p>
      <p>
        This portal ensures transparency, convenience, and a paperless experience for both citizens and officials.
        Files can be uploaded in PDF or DOC format and are viewable or downloadable by both parties.
      </p>

      <Footer />
    </div>
  );
}
