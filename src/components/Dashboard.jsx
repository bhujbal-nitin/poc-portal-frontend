// src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';
import companyLogo from '../components/Images/companyLogo.jpg';

const Dashboard = ({ onNavigate, onLogout, user }) => {
  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <div className="logo-title-container">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="dashboard-logo"
          />
          <h1>POC Portal Dashboard</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>What would you like to do?</h2>
        
        <div className="dashboard-buttons">
          <button 
            className="dashboard-btn primary-btn"
            onClick={() => onNavigate('initiate-poc')}
          >
            Initiate POC
          </button>
          
          <button 
            className="dashboard-btn secondary-btn"
            onClick={() => onNavigate('poc-prj-id')}
          >
            POC Code Creation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;