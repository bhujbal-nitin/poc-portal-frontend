import React from "react";
import TextInput from "./TextInput";

export default function UsecaseDetails({ usecase, setUsecase, brief, setBrief, errors }) {
  return (
    <div className="section-container">
      <h2 className="section-title">Usecase Details</h2>
      <div className="input-row">
        <TextInput
          label="Usecase"
          value={usecase}
          onChange={setUsecase}
          error={errors.usecase}
          required={true}   // ✅ mark required
        />
        <TextInput
          label="Brief"
          value={brief}
          onChange={setBrief}
          error={errors.brief}
          required={true}   // ✅ mark required
        />
      </div>
    </div>
  );
}
