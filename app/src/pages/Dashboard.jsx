import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6">
          <h1 className="text-2xl font-bold mb-8">FleetTrack</h1>
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink to="/vehicles" className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }>Vehicles</NavLink>
            <NavLink to="/drivers" className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }>Drivers</NavLink>
            <NavLink to="/alerts" className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }>Alerts</NavLink>
            <NavLink to="/reports" className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }>Reports</NavLink>
            <NavLink to="/settings" className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`
              }>Settings</NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
