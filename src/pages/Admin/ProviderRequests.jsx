import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function ProviderRequests() {
  const [providers, setProviders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProviders = async () => {
    const res = await axios.get("/admin/providers", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProviders(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProviders();
  }, []);

  const approve = async (id) => {
    await axios.put(`/admin/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProviders();
  };

  const reject = async (id) => {
    await axios.put(`/admin/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProviders();
  };

  return (
    <div>
      <h2>Pending Providers</h2>

      {providers.map((p) => (
        <div key={p._id} className="card">
          <h3>{p.name}</h3>
          <p>{p.email}</p>
          <p>{p.category}</p>

          <button onClick={() => approve(p._id)}>Approve</button>
          <button onClick={() => reject(p._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}