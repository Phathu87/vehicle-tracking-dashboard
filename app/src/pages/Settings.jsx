export default function Settings() {
  return (
    <div className="page">
      <h2>⚙️ Settings</h2>

      {/* Profile Section */}
      <div className="card">
        <h3>👤 Profile Settings</h3>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Contact:</strong> johndoe@example.com</p>
        <p><strong>Age:</strong> 35</p>
        <p><strong>Position:</strong> Fleet Manager</p>
        <p><strong>Cars Assigned:</strong> Toyota Hilux, Ford Ranger</p>
        <p><strong>Operational Areas:</strong> Gauteng, Limpopo</p>
        <p><strong>Employee ID:</strong> FLEET-1023</p>
      </div>

      {/* Account & Security */}
      <div className="card">
        <h3>🔐 Account & Security</h3>
        <p>Password: ********</p>
        <p>2FA: Enabled</p>
        <p>Last login: 2025-09-05 14:32</p>
        <p>Session activity: 2 devices active</p>
        <button className="btn">Change Password</button>
        - -
        <button className="btn">Manage 2FA</button>
      </div>

      {/* Privacy & Data Sharing */}
      <div className="card">
        <h3>🔒 Privacy & Data</h3>
        <p>Data Sharing: Off</p>
        <p>Location Tracking: On</p>
        <p>Report Sharing: Enabled</p>
        <button className="btn">Adjust Privacy Settings</button>
      </div>

      {/* Vehicle Settings */}
      <div className="card">
        <h3>🚗 Vehicle Settings</h3>
        <p>Default Speed Alerts: 80 km/h</p>
        <p>Idle Time Alerts: 10 min</p>
        <p>Geofence Alerts: Enabled</p>
        <p>Vehicle Notifications: Email & SMS</p>
        <button className="btn">Manage Alerts</button>
      </div>

      {/* Map & Tracking */}
      <div className="card">
        <h3>🗺️ Map & Tracking</h3>
        <p>Default Map View: Satellite</p>
        <p>Tracking Frequency: 30 sec</p>
        <p>Show Vehicle Status: Online / Offline</p>
        <button className="btn">Adjust Map Settings</button>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3>🔔 Notifications</h3>
        <p>Email Alerts: Enabled</p>
        <p>SMS Alerts: Enabled</p>
        <p>Push Notifications: Enabled</p>
        <button className="btn">Manage Notification Preferences</button>
      </div>

      {/* Activity Logs */}
      <div className="card">
        <h3>📊 Activity Logs</h3>
        <p>Recent Logins: 5</p>
        <p>Vehicles Tracked Today: 12</p>
        <p>Alerts Triggered: 3</p>
        <button className="btn">View Full Activity Log</button>
      </div>

      {/* Help */}
      <div className="card">
        <h3>❓ Help & Support</h3>
        <p>Contact support: support@fleet.com</p>
        <p>FAQ & Guides: Available</p>
        <button className="btn">Open Help Center</button>
      </div>

      {/* About */}
      <div className="card">
        <h3>ℹ️ About</h3>
        <p>Fleet Management v1.0 – Developed by Phathu 🚀</p>
        <p>Last Update: 2025-09-01</p>
      </div>
    </div>
  );
}

