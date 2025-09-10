import "./Pageheading.css";
import logo from "./Images/companyLogo.Jpg"; // 👈 place your logo image in src folder (adjust path)

export default function Pageheading() {
  return (
    <header className="page-header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <h1 className="page-title">POC Portal</h1>
    </header>
  );
}
