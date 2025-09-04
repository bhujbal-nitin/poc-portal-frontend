import React from "react";
import "./Button.css";

export default function Button({ onClick, type}) {
  return (
    <div className="submit-container">
      <button className="submit-btn" onClick={onClick} type={type}>
        Initiate POC
      </button>
    </div>
  );
}
