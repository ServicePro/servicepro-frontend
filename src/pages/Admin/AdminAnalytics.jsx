import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

const AdminAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getAnalytics();
        if (response.success) {
          setData(response.data.trend || []);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading analytics...</div>;
  }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h2 style={{ margin: '0 0 24px 0', color: '#111827' }}>Platform Activity (Last 6 Months)</h2>
      
      {data.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Not enough data to display trends yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {data.map((monthData, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb' }}>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: '8px' }}>{monthData.month}</div>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>Total Bookings: <strong>{monthData.totalAppointments}</strong></div>
              <div style={{ fontSize: '14px', color: '#10b981' }}>Completed: <strong>{monthData.completedAppointments}</strong></div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto 24px' }}>
          We are working on bringing you advanced global performance metrics, revenue forecasting, and interactive charts in an upcoming update.
        </p>
        <button style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 20px', fontWeight: 500, cursor: 'not-allowed' }}>
          Export CSV Data (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default AdminAnalytics;
