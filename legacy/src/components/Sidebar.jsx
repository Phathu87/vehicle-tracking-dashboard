import { NavLink, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaCar, FaUser, FaExclamationTriangle, FaChartBar, FaCog } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const location = useLocation();
  const [indicatorPos, setIndicatorPos] = useState({ top: 0, height: 0 });
  const navRef = useRef(null);

  const links = [
    { name: "Dashboard", to: "/", icon: <FaTachometerAlt className="icon-3d" /> },
    { name: "Vehicles", to: "/vehicles", icon: <FaCar className="icon-3d" /> },
    { name: "Drivers", to: "/drivers", icon: <FaUser className="icon-3d" /> },
    { name: "Alerts", to: "/alerts", icon: <FaExclamationTriangle className="icon-3d" /> },
    { name: "Reports", to: "/reports", icon: <FaChartBar className="icon-3d" /> },
    { name: "Settings", to: "/settings", icon: <FaCog className="icon-3d" /> },
  ];

  useEffect(() => {
    if (!navRef.current) return;
    const linksElements = Array.from(navRef.current.children).filter(el => el.classList.contains("nav-link"));
    const activeElement = linksElements.find(el => el.classList.contains("active"));
    if (activeElement) {
      const { offsetTop, offsetHeight } = activeElement;
      setIndicatorPos({ top: offsetTop, height: offsetHeight });
    }
  }, [location.pathname, menuOpen]);

  return (
    <aside className={`sidebar fixed md:relative z-50 top-0 left-0 h-full bg-gray-900 text-gray-200 p-4 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      {/* Close button - mobile only */}
      <button
        className="close-btn md:hidden mb-4 text-white z"
        onClick={() => setMenuOpen(false)}
      >
        ✕
      </button>

      <header className="brand-header mb-6">
        <h1 className="brand text-xl font-bold">FleetTrack</h1>
      </header>

      <nav className="nav-links relative" ref={navRef}>
        <div className="active-indicator" style={{ top: indicatorPos.top, height: indicatorPos.height }} />
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            end={link.to === "/"}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

