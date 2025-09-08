import React from "react";
import "./TextInput.css";

export default function TextInput({ label, value, onChange, error, required }) {
  return (
    <div className="textinput-container">
      <label className="textinput-label">
        {label}
        {required && <span style={{ color: "red" }}> *</span>} 
        {/* ✅ only show red star if required is true */}
      </label>
      <input
        value={value} // controlled input
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}`}
        className={`textinput-field ${error ? "error" : ""}`}
      />

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
