import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './UserProfile.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function UserProfile() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const getStored = () => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  };
  const stored = getStored();

  const [form, setForm] = useState({
    name:            stored.name  || '',
    email:           stored.email || '',
    phone:           '',
    bio:             '',
    address:         '',
    dob:             '',
    password:        '',
    confirmPassword: '',
  });

  const [avatarPreview,    setAvatarPreview]    = useState(
    stored.avatarUrl ? `${API}${stored.avatarUrl}` : null
  );
  const [avatarFile,       setAvatarFile]       = useState(null);
  const [uploadingAvatar,  setUploadingAvatar]  = useState(false);

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const displayAvatar = avatarPreview ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=F97316&color=fff&size=128`;
  const [activeTab, setActiveTab] = useState('Profile');

  // Sync fresh data from backend
  useEffect(() => {
    axios.get(`${API}/api/users/profile`, authHeaders())
      .then((res) => {
        const u = res.data?.data?.user || res.data?.data || {};
        setForm((prev) => ({
          ...prev,
          name:    u.name    || prev.name,
          email:   u.email   || prev.email,
          phone:   u.phone   || '',
          bio:     u.bio     || '',
          address: u.address || '',
          dob:     u.dob     || '',
        }));
        if (u.avatarUrl) setAvatarPreview(`${API}${u.avatarUrl}`);
      })
      .catch(() => {/* use localStorage fallback */});
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    setError(''); setSuccess('');
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', avatarFile);
      const res = await axios.post(`${API}/api/users/avatar`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = res.data?.avatarUrl;
      const curr = getStored();
      localStorage.setItem('user', JSON.stringify({ ...curr, avatarUrl: url }));
      if (url) setAvatarPreview(`${API}${url}`);
      setAvatarFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Avatar upload failed.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (avatarFile) await uploadAvatar();
      const body = {
        name:    form.name,
        email:   form.email,
        phone:   form.phone,
        bio:     form.bio,
        address: form.address,
        dob:     form.dob,
      };
      if (form.password) body.password = form.password;
      const res = await axios.put(`${API}/api/users/profile`, body, authHeaders());
      const updated = res.data?.data || {};
      const newUser = { ...getStored(), ...updated };
      localStorage.setItem('user', JSON.stringify(newUser));
      setSuccess('Profile updated successfully!');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const TABS = ['Profile', 'Security', 'Account'];

  return (
    <div className="up-root">
      <UserNavbar />
      <div className="up-wrap">

        {/* ── Sidebar ── */}
        <aside className="up-aside">
          <div className="up-avatar-wrap">
            {/* Clickable avatar with camera overlay */}
            <div className="up-avatar-pic-wrap" onClick={() => fileRef.current?.click()} title="Click to change photo">
              <img src={displayAvatar} alt="profile" className="up-avatar" />
              <div className="up-avatar-overlay">📷 Change</div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            {avatarFile && (
              <div className="up-avatar-actions">
                <button
                  className="up-avatar-save-btn"
                  onClick={async () => { setSaving(true); await uploadAvatar(); setSaving(false); setSuccess('Photo updated!'); }}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? 'Uploading…' : '✅ Save Photo'}
                </button>
                <button className="up-avatar-remove-btn" onClick={handleRemoveAvatar}>✕</button>
              </div>
            )}
            <div className="up-avatar-name">{form.name || 'User'}</div>
            <div className="up-avatar-email">{form.email || ''}</div>
            {form.phone && <div className="up-avatar-phone">📞 {form.phone}</div>}
            <span className="up-role-badge">{stored.role || 'User'}</span>
          </div>

          <nav className="up-side-nav">
            {TABS.map((t) => (
              <button
                key={t}
                className={`up-side-btn${activeTab === t ? ' active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'Profile'  && '👤 '}
                {t === 'Security' && '🔒 '}
                {t === 'Account'  && '⚙️ '}
                {t}
              </button>
            ))}
          </nav>

          <button className="up-logout-btn" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </aside>

        {/* ── Main panel ── */}
        <main className="up-main">

          {success && <div className="up-alert up-alert-success">✅ {success}</div>}
          {error   && <div className="up-alert up-alert-error">❌ {error}</div>}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'Profile' && (
            <form className="up-card" onSubmit={handleSave}>
              <h2 className="up-card-title">Personal Information</h2>
              <p className="up-card-sub">Required fields update your account. Optional fields personalise your experience — fill what you like.</p>

              <div className="up-photo-row">
                <img src={displayAvatar} alt="preview" className="up-photo-preview" />
                <div className="up-photo-info">
                  <p className="up-photo-hint">Click your photo on the left to change it.<br/>JPG, PNG or WebP · max 4 MB.</p>
                  {avatarFile && <p className="up-photo-selected">📎 {avatarFile.name}</p>}
                </div>
              </div>

              <div className="up-divider-label">Required</div>

              <div className="up-field">
                <label className="up-label">Full Name</label>
                <input className="up-input" name="name" value={form.name}
                  onChange={handleChange} placeholder="Your full name" required />
              </div>

              <div className="up-field">
                <label className="up-label">Email Address</label>
                <input className="up-input" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com" required />
              </div>

              <div className="up-divider-label">Optional — fill what you like</div>

              <div className="up-two-col">
                <div className="up-field">
                  <label className="up-label">Phone Number <span className="up-opt">(optional)</span></label>
                  <input className="up-input" name="phone" type="tel" value={form.phone}
                    onChange={handleChange} placeholder="+94 77 000 0000" />
                </div>
                <div className="up-field">
                  <label className="up-label">Date of Birth <span className="up-opt">(optional)</span></label>
                  <input className="up-input" name="dob" type="date" value={form.dob}
                    onChange={handleChange} />
                </div>
              </div>

              <div className="up-field">
                <label className="up-label">Address / City <span className="up-opt">(optional)</span></label>
                <input className="up-input" name="address" value={form.address}
                  onChange={handleChange} placeholder="e.g. 42 Main St, Colombo" />
              </div>

              <div className="up-field">
                <label className="up-label">Bio <span className="up-opt">(optional)</span></label>
                <textarea className="up-input up-textarea" name="bio" value={form.bio}
                  onChange={handleChange} placeholder="Tell us a little about yourself…" rows={3} />
              </div>

              <button className="up-save-btn" type="submit" disabled={saving || uploadingAvatar}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'Security' && (
            <form className="up-card" onSubmit={handleSave}>
              <h2 className="up-card-title">Change Password</h2>
              <p className="up-card-sub">Leave blank to keep your current password.</p>

              <div className="up-field">
                <label className="up-label">New Password</label>
                <input
                  className="up-input"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="up-field">
                <label className="up-label">Confirm New Password</label>
                <input
                  className="up-input"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                />
              </div>

              <button className="up-save-btn" type="submit" disabled={saving}>
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Account Tab */}
          {activeTab === 'Account' && (
            <div className="up-card">
              <h2 className="up-card-title">Account Overview</h2>
              <p className="up-card-sub">Summary of your ServicePro account.</p>

              <div className="up-account-grid">
                {[
                  { icon: '📋', label: 'Service History',   action: () => navigate('/service-history'),      btn: 'View →' },
                  { icon: '⭐', label: 'Reviews & Ratings', action: () => navigate('/reviews'),              btn: 'View →' },
                  { icon: '💎', label: 'Subscription',       action: () => navigate('/subscription'),         btn: 'Manage →' },
                  { icon: '💬', label: 'Messages',           action: () => navigate('/chat'),                 btn: 'Open →' },
                  { icon: '🚨', label: 'Emergency Services', action: () => navigate('/emergency'),            btn: 'Open →' },
                  { icon: '🎥', label: 'Video Consultation', action: () => navigate('/video-consultation'),   btn: 'Open →' },
                ].map((item) => (
                  <div key={item.label} className="up-stat-card">
                    <div className="up-stat-icon">{item.icon}</div>
                    <div className="up-stat-label">{item.label}</div>
                    <div className="up-stat-action"><button onClick={item.action}>{item.btn}</button></div>
                  </div>
                ))}
              </div>

              {/* ── Saved Payment Methods ── */}
              <SavedCards />

              <div className="up-danger-zone">
                <h3 className="up-danger-title">Danger Zone</h3>
                <p className="up-danger-sub">Once you sign out, you will need to log in again.</p>
                <button className="up-logout-btn-inline" onClick={handleLogout}>
                  Sign Out of Account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* ── Saved Payment Methods widget ── */
function SavedCards() {
  const [cards, setCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedCards') || '[]'); } catch { return []; }
  });

  const remove = (index) => {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
    localStorage.setItem('savedCards', JSON.stringify(updated));
  };

  return (
    <div className="up-pm-section">
      <div className="up-divider-label">Saved Payment Methods</div>
      {cards.length === 0 ? (
        <p className="up-pm-empty">No saved cards yet. Cards used at checkout appear here.</p>
      ) : (
        <div className="up-pm-list">
          {cards.map((c, i) => (
            <div key={i} className="up-pm-card">
              <span className="up-pm-icon">💳</span>
              <div className="up-pm-info">
                <span className="up-pm-number">•••• •••• •••• {c.last4}</span>
                <span className="up-pm-meta">{c.name} · Exp {c.expiry}</span>
              </div>
              <button className="up-pm-remove" onClick={() => remove(i)} title="Remove">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
