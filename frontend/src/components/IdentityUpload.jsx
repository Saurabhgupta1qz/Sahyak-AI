import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IdentityUpload() {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [licensefile, setLicenseFile] = useState(null);
  const [type, setType] = useState("License Renewal");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!frontFile || !backFile || !licensefile) return;

    const formData = new FormData();
    formData.append("frontImage", frontFile);
    formData.append("rearImage", backFile);
    formData.append("licenseImage", licensefile);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(`http://localhost:3000/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      // const submissions = JSON.parse(
      //   localStorage.getItem("submissions") || "[]"
      // );

      // submissions.push({
      //   type: type,
      //   identity: {
      //     Name: "Unknown", // Future OCR can fill this
      //     DOB: "Unknown",
      //     Gender: "Unknown",
      //     Aadhaar_Number: "Unknown",
      //     Address: "Unknown",
      //   },
      //   frontFile: { name: frontFile.name, url: data.frontUrl },
      //   backFile: { name: backFile.name, url: data.backUrl },
      //   licensefile: { name: licensefile.name, url: data.backUrl },
      //   status: "Pending",
      // });

      // localStorage.setItem("submissions", JSON.stringify(submissions));
      alert("Identity Proof Uploaded!");
      navigate("/citizen");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  }

  return (
    <div className="container fullscreen">
      <h2>Upload Identity Proof</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 450 }}>
        <label>Select Service</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          style={{ marginBottom: 10 }}
        >
          <option>License Renewal</option>
          <option>Loan</option>
          <option>Other</option>
        </select>

        <label>Front Side JPG</label>
        <input
          type="file"
          accept=".jpg,.jpeg"
          onChange={(e) => setFrontFile(e.target.files[0])}
          required
        />

        <label style={{ marginTop: 10 }}>Back Side JPG</label>
        <input
          type="file"
          accept=".jpg,.jpeg"
          onChange={(e) => setBackFile(e.target.files[0])}
          required
        />

        <h2>Upload Application Form</h2>
        <label style={{ marginTop: 10 }}>Application form JPG</label>
        <input
          type="file"
          accept=".jpg,.jpeg"
          onChange={(e) => setLicenseFile(e.target.files[0])}
          required
        />

        <button type="submit" style={{ marginTop: 15, width: "100%" }}>
          Submit Identity Proof
        </button>
      </form>
    </div>
  );
}
