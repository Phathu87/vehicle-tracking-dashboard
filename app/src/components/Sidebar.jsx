import React from "react";
import "./Sidebar.css"; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">FleetTrack</h2>
      <ul className="menu">
        <li className="active">Dashboard</li>
        <li>Vehicles</li>
        <li>Drivers</li>
        <li>Alerts</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
