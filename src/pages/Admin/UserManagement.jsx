import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getAllUsers();
      if (response.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (!window.confirm(`Are you sure you want to change the status of ${user.name}?`)) return;
    try {
      const type = user.role.toLowerCase() === 'provider' ? 'provider' : 'user';
      const response = await adminApi.toggleUserStatus(user._id, type);
      if (response.success) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>System Users</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search users..." 
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Email</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Role</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Joined Date</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: '#4b5563', fontSize: '14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', color: '#111827', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                      backgroundColor: u.role === 'provider' ? '#dbeafe' : '#f3f4f6',
                      color: u.role === 'provider' ? '#1e40af' : '#4b5563',
                      textTransform: 'capitalize'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                      backgroundColor: u.status === 'Active' ? '#dcfce7' : (u.status === 'Pending' ? '#fef3c7' : '#fee2e2'),
                      color: u.status === 'Active' ? '#166534' : (u.status === 'Pending' ? '#b45309' : '#991b1b')
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>{new Date(u.joined).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', textAlign: 'right', gap: '8px' }}>
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      style={{ border: 'none', background: 'transparent', color: u.status === 'Suspended' || u.status === 'Unverified' ? '#10b981' : '#ef4444', cursor: 'pointer', fontWeight: 500 }}
                    >
                      {u.status === 'Suspended' || u.status === 'Unverified' ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
