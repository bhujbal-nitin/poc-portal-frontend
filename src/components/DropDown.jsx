import React from "react";
import "./Dropdown.css";

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  error,
  loading = false,
  fetchError = null,
}) {
  return (
    <div className="dropdown-container">
      <label className="dropdown-label">
        {label} <span style={{ color: "red" }}>*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`dropdown-select ${error ? "error" : ""}`}
        disabled={loading || fetchError} // disable if loading or fetch error
      >
        <option value="">
          {loading
            ? "Loading..."
            : fetchError
            ? "⚠️ Error loading data"
            : "-- Select --"}
        </option>

        {!loading &&
          !fetchError &&
          options.map((item, idx) => (
            <option key={idx} value={item}>
              {item}
            </option>
          ))}
      </select>

      {error && <p className="error-message">{error}</p>}
      {fetchError && <p className="error-message">⚠️ {fetchError}</p>}
    </div>
  );
}
