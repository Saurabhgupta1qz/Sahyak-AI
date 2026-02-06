import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    contacts.push({ name, email, message });
    localStorage.setItem("contacts", JSON.stringify(contacts));
    setSubmitted(true);
    setName(""); setEmail(""); setMessage("");
  }

  return (
    <div className="container fullscreen">
      <div className="header">
        <h2>Contact Us</h2>
        <Link to="/"><button>Logout</button></Link>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
          <input 
            type="text" placeholder="Your Name" value={name} 
            onChange={e=>setName(e.target.value)} required 
          />
          <input 
            type="email" placeholder="Your Email" value={email} 
            onChange={e=>setEmail(e.target.value)} required 
          />
          <textarea 
            placeholder="Your Message" value={message} 
            onChange={e=>setMessage(e.target.value)} rows={5} required 
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p style={{marginTop:20}}>Thank you! Your message has been submitted.</p>
      )}

      <Footer />
    </div>
  );
}
