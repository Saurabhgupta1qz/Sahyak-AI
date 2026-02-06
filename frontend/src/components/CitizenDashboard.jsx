import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("submissions") || "[]");
    setSubmissions(data);
  }, []);

  const [selectedType, setSelectedType] = useState("");

  function chooseType(type) {
    const newSubs = [...submissions];
    const lastIndex = newSubs.length - 1;
    if (lastIndex >= 0) {
      newSubs[lastIndex].type = type;
      localStorage.setItem("submissions", JSON.stringify(newSubs));
      setSubmissions(newSubs);
      setSelectedType(type);
      alert(`You selected: ${type}`);
    }
  }

  function getColor(status) {
    if (status === "Approved") return "#d4edda";
    if (status === "Pending") return "#fff3cd";
    if (status === "Rejected") return "#f8d7da";
    return "#f5f3f0";
  }

  function downloadFile(file) {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  }

  return (
    <div className="container fullscreen">
      <div className="header">
        <h2>Citizen Dashboard</h2>
        <div>
          <Link to="/about">
            <button>About</button>
          </Link>
          <Link to="/contact">
            <button style={{ marginLeft: 8 }}>Contact Us</button>
          </Link>
          <Link to="/">
            <button style={{ marginLeft: 8 }}>Logout</button>
          </Link>
        </div>
      </div>

      {/* Upload Links */}
      <div className="stack" style={{ maxWidth: 600 }}>
        <Link to="/identity-application">
          <button>Upload Identity Proof (Front & Back JPG)</button>
        </Link>
        {/* <Link to="/application"><button>Upload Application Form (JPG)</button></Link> */}
      </div>

      {/* Three Options Buttons */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={() => chooseType("License Renewal")}>
          License Renewal
        </button>
        <button onClick={() => chooseType("Loan")}>Loan</button>
        <button onClick={() => chooseType("Other")}>Other</button>
      </div>

      {/* Display Your Applications */}
      <h3 style={{ marginTop: 30 }}>Your Applications</h3>
      {submissions.length === 0 && <p>No applications yet.</p>}

      {submissions.map((s, i) => (
        <div
          key={i}
          style={{
            background: getColor(s.status),
            padding: 15,
            marginTop: 12,
            borderRadius: 8,
            border: "1px solid #8b5e3c",
          }}
        >
          <p>
            <b>Type:</b> {s.type || "N/A"}
          </p>
          <p>
            <b>Name:</b> {s.identity?.Name || "N/A"}
          </p>
          <p>
            <b>DOB:</b> {s.identity?.DOB || "N/A"}
          </p>
          <p>
            <b>Gender:</b> {s.identity?.Gender || "N/A"}
          </p>
          <p>
            <b>Aadhaar:</b> {s.identity?.Aadhaar_Number || "N/A"}
          </p>
          <p>
            <b>Address:</b> {s.identity?.Address || "N/A"}
          </p>

          {s.frontFile && (
            <button onClick={() => downloadFile(s.frontFile)}>
              View Front
            </button>
          )}
          {s.backFile && (
            <button onClick={() => downloadFile(s.backFile)}>View Back</button>
          )}
          {s.application && (
            <button onClick={() => downloadFile(s.application)}>
              View Application
            </button>
          )}

          <p>
            <b>Status:</b> {s.status || "Pending"}
          </p>
          {s.eta && (
            <p>
              <b>ETA:</b> {s.eta} days
            </p>
          )}
        </div>
      ))}

      <Footer />
    </div>
  );
}
