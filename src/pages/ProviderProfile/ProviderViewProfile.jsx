import axios from 'axios';
import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Beauty & Wellness',
  'Home Repair',
  'Other',
];

const resolveProfileImage = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${API}${normalized}`;
};

const ProviderViewProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/providers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const provider = res.data?.data?.provider;
        if (provider) {
          setForm({
            name: provider.name || '',
            email: provider.email || '',
            phone: provider.phone || '',
            category: provider.category || '',
          });
          setProfileImagePreview(resolveProfileImage(provider.profile_image));
        }
      } catch {
        setMessage('Unable to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const token = localStorage.getItem('token');
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('phone', form.phone);
      payload.append('category', form.category);

      if (profileImageFile) {
        payload.append('profilePhoto', profileImageFile);
      }

      const res = await axios.put(`${API}/api/providers/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        const provider = res.data?.data?.provider;
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.name = form.name;
          user.phone = form.phone;
          user.category = form.category;
          user.profile_image = provider?.profile_image || user.profile_image || '';
          localStorage.setItem('user', JSON.stringify(user));
        }

        if (provider?.profile_image) {
          setProfileImagePreview(resolveProfileImage(provider.profile_image));
        }

        setProfileImageFile(null);
        window.dispatchEvent(new Event('provider-profile-updated'));
        setMessage('Profile updated successfully.');
      }
    } catch {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('Fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New password and confirm password must match.');
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordMessage('');
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API}/api/providers/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordMessage('Password changed successfully.');
      }
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card provider-profile-card">
        <h3>Loading profile...</h3>
      </div>
    );
  }

  return (
    <div className="card provider-profile-card" style={{ maxWidth: '720px' }}>
      <div className="provider-profile-hero">
        <div>
          <span className="provider-profile-chip">Provider Profile</span>
          <h2 style={{ marginBottom: '6px', marginTop: '10px' }}>View Profile</h2>
          <p style={{ marginBottom: '0' }}>Keep your provider information up to date.</p>
        </div>
        <div className="provider-profile-visual">
          {profileImagePreview ? (
            <img src={profileImagePreview} alt="Provider profile" className="provider-profile-photo" />
          ) : (
            <div className="provider-profile-photo provider-profile-photo-fallback">
              {(form.name || 'S').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="provider-profile-form">
      <div className="form-group provider-profile-group" style={{ marginBottom: '14px', marginTop: '20px' }}>
        <label className="form-label">Profile Image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="form-input provider-profile-input provider-profile-file"
          onChange={handleImageSelect}
        />
      </div>

      <div className="form-group provider-profile-group" style={{ marginBottom: '14px', marginTop: '20px' }}>
        <label className="form-label">Full Name</label>
        <input
          className="form-input provider-profile-input"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div className="form-group provider-profile-group" style={{ marginBottom: '14px' }}>
        <label className="form-label">Email</label>
        <input className="form-input provider-profile-input provider-profile-input-disabled" value={form.email} disabled />
      </div>

      <div className="form-group provider-profile-group" style={{ marginBottom: '14px' }}>
        <label className="form-label">Phone</label>
        <input
          className="form-input provider-profile-input"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter your phone"
        />
      </div>

      <div className="form-group provider-profile-group" style={{ marginBottom: '18px' }}>
        <label className="form-label">Category</label>
        <select
          className="form-select provider-profile-input"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="provider-profile-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-primary_1 provider-profile-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <span className="provider-profile-message">{message}</span>}
      </div>
      </div>

      <div className="provider-profile-password card" style={{ marginTop: '20px' }}>
        <span className="provider-profile-chip">Security</span>
        <h3 style={{ marginTop: '12px', marginBottom: '6px' }}>Change Password</h3>
        <p style={{ marginBottom: '18px' }}>Update your account password securely.</p>

        <div className="form-group provider-profile-group" style={{ marginBottom: '14px' }}>
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-input provider-profile-input"
            value={passwordForm.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group provider-profile-group" style={{ marginBottom: '14px' }}>
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-input provider-profile-input"
            value={passwordForm.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group provider-profile-group" style={{ marginBottom: '18px' }}>
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-input provider-profile-input"
            value={passwordForm.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <div className="provider-profile-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-primary_1 provider-profile-save" onClick={handlePasswordSave} disabled={passwordSaving}>
            {passwordSaving ? 'Updating...' : 'Change Password'}
          </button>
          {passwordMessage && <span className="provider-profile-message">{passwordMessage}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProviderViewProfile;
