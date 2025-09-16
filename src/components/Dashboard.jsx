// src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

const Dashboard = ({ onNavigate, onLogout, user }) => {
  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <div className="logo-title-container">
          <div className="dashboard-logo-placeholder">
            <span>Company Logo</span>
          </div>
          <h1>POC Portal Dashboard</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.username || 'User'}</span>
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
            onClick={() => onNavigate('poc-table')}
          >
            POC Code Creation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;