// Header.jsx
import React from "react";

function Header({ onMenuClick }) {
  return (
    <>
      <div className="header">
        <button className="menu-btn" onClick={onMenuClick}>
          <i className="fa-solid fa-bars" />
        </button>

        <div className="page-title">
          <h1>Welcome Abhinav B</h1>
        </div>

        <div className="header-actions">
          <button className="notification-btn" title="Notifications">
            🔔
            <span className="notification-badge">2</span>
          </button>
          <div className="current-date">Monday, Dec 1, 2025</div>
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="the_line" />
    </>
  );
}


export default Header;
