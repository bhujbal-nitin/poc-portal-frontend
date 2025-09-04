import React from "react";
import "./TextInput.css";

export default function TextInput({ label, value, onChange, error }) {
    return (
        <div className="textinput-container">
            <label className="textinput-label">
                {label} <span style={{ color: "red" }}>*</span>
            </label>
            <input
                value={value}                  // must be controlled
                onChange={(e) => onChange(e.target.value)}  // pass value to handleChange
                placeholder={`Enter ${label}`}
                className={`textinput-field ${error ? "error" : ""}`}
            />

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
