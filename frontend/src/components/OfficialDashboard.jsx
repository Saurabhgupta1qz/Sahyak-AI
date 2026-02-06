import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function OfficialDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        // Ensure the data is an array (wrap single object if needed)
        const userArray = Array.isArray(data) ? data : [data];

        // Format to match expected structure
        const formatted = userArray.map((user) => ({
          identity: {
            Name: user.name || "N/A",
            DOB: user.dob || user.DOB || "N/A",
            Gender: user.gender || "N/A",
            Aadhaar_Number: user.aadhar_number || user.Aadhaar_Number || "N/A",
            Address: user.address || "N/A",
            Photo_Path: user.photo_path || "N/A",
          },
          license: {
            Number: user.Number || "N/A",
            Date_of_Issue: user.Date_of_issue || "N/A",
            Class_of_Vehicles: user.Class_of_Vehicles || "N/A",
            Issued_by: user.Issued_by || "N/A",
            Fee_paid: user.Fee_paid || "N/A",
            Signature_Path: user.Signature_path || "N/A",
          },
          status: "Pending",
          eta: "",
        }));

        setSubmissions(formatted);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatus = (index, status) => {
    const newSubs = [...submissions];
    newSubs[index].status = status;
    if (status === "Approved" || status === "Pending") {
      newSubs[index].eta = Math.floor(Math.random() * 5 + 1); // ETA 1–5 days
    } else {
      newSubs[index].eta = "";
    }
    setSubmissions(newSubs);
  };

  const getColor = (status) => {
    if (status === "Approved") return "#d4edda";
    if (status === "Pending") return "#fff3cd";
    if (status === "Rejected") return "#f8d7da";
    return "#f5f3f0";
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container fullscreen">
      <div className="header">
        <h2>Official Dashboard</h2>
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

      {submissions.length === 0 && <p>No users found.</p>}

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
            <b>Name:</b> {s.identity?.Name}
          </p>
          <p>
            <b>DOB:</b> {s.identity?.DOB}
          </p>
          <p>
            <b>Gender:</b> {s.identity?.Gender}
          </p>
          <p>
            <b>Aadhaar:</b> {s.identity?.Aadhaar_Number}
          </p>
          <p>
            <b>Address:</b> {s.identity?.Address}
          </p>
          <p>
            <b>License Number:</b> {s.license?.Number}
          </p>
          <p>
            <b>Date of Issue:</b> {s.license?.Date_of_Issue}
          </p>
          <p>
            <b>Class of Vehicles:</b> {s.license?.Class_of_Vehicles}
          </p>
          <p>
            <b>Issued by:</b> {s.license?.Issued_by}
          </p>
          <p>
            <b>Fee Paid:</b> {s.license?.Fee_paid}
          </p>

          <p>
            <b>Status:</b> {s.status}
          </p>
          {s.eta && (
            <p>
              <b>ETA:</b> {s.eta} days
            </p>
          )}

          <div
            className="stack"
            style={{ flexDirection: "row", gap: 10, marginTop: 5 }}
          >
            <button onClick={() => handleStatus(i, "Approved")}>Approve</button>
            <button onClick={() => handleStatus(i, "Pending")}>Pending</button>
            <button onClick={() => handleStatus(i, "Rejected")}>Reject</button>
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
}
