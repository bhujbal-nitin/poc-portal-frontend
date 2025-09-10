import React from "react";
import "./Button.css";

export default function Button({ onClick, type, label, disabled }) {
  return (
    <div className="submit-container">
      <button
        className={`submit-btn ${disabled ? "disabled" : ""}`}
        onClick={disabled ? undefined : onClick} // prevent click when disabled
        type={type}
        disabled={disabled} // native disable
      >
        {label}
      </button>
    </div>
  );
}
