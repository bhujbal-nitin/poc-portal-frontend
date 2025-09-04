import React, { useState, useEffect } from "react";
import Pageheading from "./components/Pageheading";
import Dropdown from "./components/DropDown";
import TextInput from "./components/TextInput";
import UsecaseDetails from "./components/UsecaseDetails";
import Button from "./components/Button";
// import { regions, endCustomerTypes, processTypes } from "./data";
import "./App.css";

function App() {
  // Dropdown states
  // Dropdown states
  const [salesPerson, setSalesPerson] = useState("");
  const [salesPersons, setSalesPersons] = useState([]);

  const [region, setRegion] = useState("");  // 👈 missing
  const [regions, setRegions] = useState([]);

  const [endCustomerType, setEndCustomerType] = useState(""); // 👈 missing
  const [endCustomerTypes, setEndCustomerTypes] = useState([]);

  const [processType, setProcessType] = useState(""); // 👈 missing
  const [processTypes, setProcessTypes] = useState([]);


  // Customer Info states
  const [companyName, setCompanyName] = useState("");
  const [spoc, setSpoc] = useState("");
  const [spocManager, setSpocManager] = useState("");
  const [degree, setDegree] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Usecase Details states
  const [usecase, setUsecase] = useState("");
  const [brief, setBrief] = useState("");

  // Error states
  const [errors, setErrors] = useState({});

  // 🔹 Fetch sales persons from backend on mount
  useEffect(() => {
    // Sales Persons
    fetch("http://localhost:5050/poc/getAllSalesPerson")
      .then(res => res.json())
      .then(setSalesPersons)
      .catch(err => console.error("Error fetching sales:", err));

    // Regions
    fetch("http://localhost:5050/poc/getAllRegion")
      .then(res => res.json())
      .then(setRegions)
      .catch(err => console.error("Error fetching regions:", err));

    // End Customer Types
    fetch("http://localhost:5050/poc/getAllCustomerTypes")
      .then(res => res.json())
      .then(setEndCustomerTypes)
      .catch(err => console.error("Error fetching end customer types:", err));

    // Process Types
    fetch("http://localhost:5050/poc/getAllProcessType")
      .then(res => res.json())
      .then(setProcessTypes)
      .catch(err => console.error("Error fetching process types:", err));
  }, []);


  // Live update & remove error
  const handleChange = (field, value) => {
    switch (field) {
      case "salesPerson": setSalesPerson(value); break;
      case "region": setRegion(value); break;
      case "endCustomerType": setEndCustomerType(value); break;
      case "processType": setProcessType(value); break;
      case "companyName": setCompanyName(value); break;
      case "spoc": setSpoc(value); break;
      case "spocManager": setSpocManager(value); break;
      case "degree": setDegree(value); break;
      case "mobileNumber": setMobileNumber(value); break;
      case "usecase": setUsecase(value); break;
      case "brief": setBrief(value); break;
      default: break;
    }

    // Remove error if field becomes valid
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (field === "mobileNumber") {
        if (/^[0-9]{10}$/.test(value)) delete newErrors[field];
      } else if (value) {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  // Form submit
  const handleSubmit = () => {
    let newErrors = {};

    if (!salesPerson) newErrors.salesPerson = "Required";
    if (!region) newErrors.region = "Required";
    if (!endCustomerType) newErrors.endCustomerType = "Required";
    if (!processType) newErrors.processType = "Required";
    if (!companyName) newErrors.companyName = "Required";
    if (!spoc) newErrors.spoc = "Required";
    if (!spocManager) newErrors.spocManager = "Required";
    if (!degree) newErrors.degree = "Required";
    if (!mobileNumber) {
      newErrors.mobileNumber = "Required";
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Must be 10 digits";
    }
    if (!usecase) newErrors.usecase = "Required";
    if (!brief) newErrors.brief = "Required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      spName:salesPerson,
      region:region,
      endCustomerType,
      processType,
      companyName,
      spoc,
      spocManager,
      degree,
      mobileNumber,
      usecase,
      brief,
    };

    console.log("Payload being sent:", payload);

    fetch("http://localhost:5050/poc/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          // ❌ API returned error (4xx / 5xx)
          const errorText = await res.text();
          throw new Error(errorText || "Unknown error");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.pocId) {
          alert("✅ POC initiated successfully 🚀 (ID: " + data.pocId + ")");

          // 🔹 Reset all fields after successful save
          setSalesPerson("");
          setRegion("");
          setEndCustomerType("");
          setProcessType("");
          setCompanyName("");
          setSpoc("");
          setSpocManager("");
          setDegree("");
          setMobileNumber("");
          setUsecase("");
          setBrief("");
          setErrors({});
        } else {
          alert("⚠️ POC creation failed (no ID returned).");
        }
      })


      .catch((err) => {
        console.error("Error saving POC:", err);
        alert("❌ POC creation failed: " + err.message);
      });
  };




  return (
    <div>
      <Pageheading />

      {/* AE Sales Info Section */}
      <div className="section-container">
        <h2 className="section-title">AE Sales Info</h2>
        <div className="dropdown-row">
          <Dropdown
            label="Sales Person Name"
            options={salesPersons}
            value={salesPerson}
            onChange={(val) => handleChange("salesPerson", val)}
            error={errors.salesPerson}
          />
          <Dropdown
            label="Region"
            options={regions}
            value={region}
            onChange={(val) => handleChange("region", val)}
            error={errors.region}
          />
          <Dropdown
            label="End Customer Type"
            options={endCustomerTypes}
            value={endCustomerType}
            onChange={(val) => handleChange("endCustomerType", val)}
            error={errors.endCustomerType}
          />
          <Dropdown
            label="Process Type"
            options={processTypes}
            value={processType}
            onChange={(val) => handleChange("processType", val)}
            error={errors.processType}
          />
        </div>
      </div>

      {/* Customer Info Section */}
      <div className="section-container">
        <h2 className="section-title">Customer Info</h2>
        <div className="input-row">
          <TextInput
            label="Company Name"
            value={companyName}
            onChange={(val) => handleChange("companyName", val)}
            error={errors.companyName}
          />
          <TextInput
            label="SPOC"
            value={spoc}
            onChange={(val) => handleChange("spoc", val)}
            error={errors.spoc}
          />
          <TextInput
            label="SPOC Manager"
            value={spocManager}
            onChange={(val) => handleChange("spocManager", val)}
            error={errors.spocManager}
          />
          <TextInput
            label="Degree"
            value={degree}
            onChange={(val) => handleChange("degree", val)}
            error={errors.degree}
          />
          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChange={(val) => handleChange("mobileNumber", val)}
            error={errors.mobileNumber}
          />
        </div>
      </div>

      {/* Usecase Details Section */}
      <UsecaseDetails
        usecase={usecase}
        setUsecase={(val) => handleChange("usecase", val)}
        brief={brief}
        setBrief={(val) => handleChange("brief", val)}
        errors={errors}
      />

      {/* Submit Button */}
      <Button onClick={handleSubmit} label="Initiate POC" type="submit" />
    </div>
  );
}

export default App;
