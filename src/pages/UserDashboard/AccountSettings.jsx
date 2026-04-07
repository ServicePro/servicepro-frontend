import { ArrowLeft, Lock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { getStoredUser, saveUserToStorage } from "../../utils/userPresentation";
import "./AccountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = getStoredUser();
    const role = savedUser?.role?.toLowerCase?.();

    if (!token) {
      navigate("/login", { replace: true, state: { from: "/account-settings" } });
      return;
    }

    if (role === "provider") {
      navigate("/provider/dashboard", { replace: true });
      return;
    }

    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    // Load user on mount so auth check happens, no profile fetch needed
    setLoading(false);
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.password) {
      setError("Please enter a new password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = new FormData();
    payload.append("password", form.password);

    try {
      setSaving(true);
      const response = await userApi.updateProfile(payload);
      const updatedUser = response?.data?.user;

      if (!updatedUser) throw new Error("Password update failed.");

      const mergedUser = {
        ...(getStoredUser() || {}),
        ...updatedUser,
        id: updatedUser._id || updatedUser.id,
      };
      saveUserToStorage(mergedUser);

      setForm({ password: "", confirmPassword: "" });
      setSuccess("Password updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="account-settings-page loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="account-settings-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="settings-container">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your password and account security</p>
        </div>

        <div className="settings-content">
          {/* PASSWORD SECTION */}
          <section className="settings-section">
            <div className="section-title">
              <Lock size={20} />
              <h2>Password &amp; Security</h2>
            </div>

            <form className="settings-form" onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={saving}>
                <Lock size={16} />
                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          {/* LOGOUT SECTION */}
          <section className="settings-section danger-zone">
            <div className="section-title">
              <LogOut size={20} />
              <h2>Logout</h2>
            </div>

            <p>Sign out from your account on this device</p>

            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
