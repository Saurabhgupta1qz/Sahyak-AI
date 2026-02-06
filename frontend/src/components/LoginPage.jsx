import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="container fullscreen" style={{textAlign:"center", paddingTop:150}}>
      <h1>Sahayak AI Portal</h1>
      <div style={{marginTop:50, display:"flex", justifyContent:"center", gap:20}}>
        <button onClick={()=>navigate("/citizen")}>Citizen</button>
        <button onClick={()=>navigate("/official")}>Official</button>
      </div>
    </div>
  );
}

