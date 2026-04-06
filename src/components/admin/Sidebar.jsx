import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#f4f4f4",
      height: "100vh",
      padding: "20px"
    }}>
      <h3>Admin Panel</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>

        <li>
          <Link to="/admin/providers">Providers</Link>
        </li>
      </ul>
    </div>
  );
}