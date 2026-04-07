import { ArrowLeft, Camera, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { getStoredUser, resolveUserAvatar, saveUserToStorage } from "../../utils/userPresentation";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [form, setForm] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
  });

  const [initialForm, setInitialForm] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    storedUser ? resolveUserAvatar(storedUser) : ""
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true, state: { from: "/view-profile" } });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await userApi.getProfile();
        const user = response?.data?.user;

        if (!user) throw new Error("Unable to load profile.");

        const merged = { ...(getStoredUser() || {}), ...user, id: user._id || user.id };
        saveUserToStorage(merged);

        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
        setInitialForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
        setPreviewImage(resolveUserAvatar(user));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = new FormData();

    const curr = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    const init = {
      name: (initialForm.name || "").trim(),
      email: (initialForm.email || "").trim(),
      phone: (initialForm.phone || "").trim(),
    };

    if (curr.name !== init.name) payload.append("name", curr.name);
    if (curr.email !== init.email) payload.append("email", curr.email);
    if (curr.phone !== init.phone) payload.append("phone", curr.phone);
    if (selectedImage) payload.append("avatar", selectedImage);

    if (!Array.from(payload.keys()).length) {
      setError("No changes to save.");
      return;
    }

    try {
      setSaving(true);
      const response = await userApi.updateProfile(payload);
      const updated = response?.data?.user;

      if (!updated) throw new Error("Profile update failed.");

      const merged = { ...(getStoredUser() || {}), ...updated, id: updated._id || updated.id };
      saveUserToStorage(merged);

      setInitialForm({
        name: updated.name || "",
        email: updated.email || "",
        phone: updated.phone || "",
      });
      setSelectedImage(null);
      setPreviewImage(resolveUserAvatar(merged));
      setSuccess("Profile updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-page loading">
        <div className="profile-loader"></div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <button className="up-back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="up-container">
        <div className="up-header">
          <h1>View Profile</h1>
          <p>Update your personal information and profile photo</p>
        </div>

        <div className="up-content">
          {/* AVATAR */}
          <section className="up-section">
            <div className="up-section-title">
              <UserRound size={20} />
              <h2>Profile Photo</h2>
            </div>

            <div className="up-avatar-editor">
              <div className="up-avatar-preview">
                {previewImage ? (
                  <img src={previewImage} alt={form.name || "User"} />
                ) : (
                  <div className="up-avatar-placeholder">
                    <UserRound size={48} />
                  </div>
                )}
              </div>

              <div className="up-avatar-actions">
                <label className="up-upload-btn">
                  <Camera size={16} />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
                <p className="up-upload-hint">JPG, PNG or WebP · Max 5MB · Square recommended</p>
              </div>
            </div>
          </section>

          {/* PERSONAL INFO */}
          <section className="up-section">
            <div className="up-section-title">
              <UserRound size={20} />
              <h2>Personal Information</h2>
            </div>

            <form className="up-form" onSubmit={handleSubmit}>
              {error && <div className="up-alert up-alert-error">{error}</div>}
              {success && <div className="up-alert up-alert-success">{success}</div>}

              <div className="up-form-group up-full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="up-form-row">
                <div className="up-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="up-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07X XXX XXXX"
                  />
                </div>
              </div>

              <button type="submit" className="up-submit-btn" disabled={saving}>
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
