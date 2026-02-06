import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ApplicationUpload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("application", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-form`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      const filePath = data.filePath;

      // Attach server filePath to citizen submission
      const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
      const lastIndex = submissions.length - 1;

      submissions[lastIndex] = {
        ...submissions[lastIndex],
        application: {
          name: file.name,
          url: filePath   // Multer saved file URL
        }
      };

      localStorage.setItem("submissions", JSON.stringify(submissions));
      alert("Application uploaded successfully!");
      navigate("/citizen");

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, please try again.");
    }
  }

  return (
    <div className="container fullscreen">
      <h3>Upload Application Form (JPG)</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          type="file"
          accept=".jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" style={{ marginTop: 10 }}>Submit</button>
      </form>
    </div>
  );
}
