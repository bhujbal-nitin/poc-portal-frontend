import React from "react";
import "./UsecaseDetails.css";
import TextInput from "./TextInput";

export default function UsecaseDetails({
  usecase,
  setUsecase,
  brief,
  setBrief,
  errors = {}          // ✅ accept errors
}) {
  return (
    <div className="section-container">
      <h2 className="section-title">Usecase Details</h2>
      <div className="usecase-row">
        <TextInput
          label="Usecase"
          value={usecase}
          onChange={setUsecase}
          error={errors.usecase}   // ✅ pass error to TextInput
        />
        <TextInput
          label="Brief"
          value={brief}
          onChange={setBrief}
          error={errors.brief}     // ✅ pass error to TextInput
        />
      </div>
    </div>
  );
}
