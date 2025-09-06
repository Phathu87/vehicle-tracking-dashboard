export default function Settings() {
  return (
    <div className="page">
      <h2>⚙️ Settings</h2>

      <div className="card">
        <h3>👤 Profile Settings</h3>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Contact:</strong> johndoe@example.com</p>
        <p><strong>Age:</strong> 35</p>
        <p><strong>Position:</strong> Fleet Manager</p>
        <p><strong>Cars Driven:</strong> Toyota Hilux, Ford Ranger</p>
        <p><strong>Locations:</strong> Gauteng, Limpopo</p>
      </div>

      <div className="card">
        <h3>🔐 Account & Security</h3>
        <p>Password: ********</p>
        <p>2FA: Enabled</p>
      </div>

      <div className="card">
        <h3>🔒 Privacy</h3>
        <p>Data Sharing: Off</p>
      </div>

      <div className="card">
        <h3>❓ Help</h3>
        <p>Contact support: support@fleet.com</p>
      </div>

      <div className="card">
        <h3>ℹ️ About</h3>
        <p>Fleet Management v1.0 – Developed by Phathu 🚀</p>
      </div>
    </div>
  );
}
