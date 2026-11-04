import { useRef, useState } from "react";
import api from "../api/axios.js";
import "../styles/ProfileEditForm.css";

function ProfileEditForm({ user, onSave, onCancel }) {
  // Profile information
  const [name, setName] = useState(user.name ?? user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [error, setError] = useState("");

  // Password information
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fileInputRef = useRef(null);

  const getInitials = (username) => {
    if (!username?.trim()) return "G";

    return username
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose JPG, PNG or WebP.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
      setError("");
    };

    reader.onerror = () => {
      setError("Could not read this image.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save profile information only
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError("Name must have at least 2 characters.");
      return;
    }

    setError("");

    onSave({
      ...user,
      name: trimmedName,
      email: trimmedEmail,
      avatar,
    });
  };

  //thay doi password
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must have at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must differ from current password.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.put("/auth/change_password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        response.data.message || "Password updated successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
          "Could not change password. Please try again.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <form className="profile_edit_form" onSubmit={handleSubmit}>
      <div className="profile_edit_heading">Update your information</div>

      {/* Avatar editor */}
      <div className="avatar_editor">
        <div
          className="avatar_preview"
          style={avatar ? { backgroundImage: `url("${avatar}")` } : {}}
        >
          {!avatar && getInitials(name)}
        </div>

        <div className="avatar_editor_copy">
          <strong>Profile picture</strong>
          <span>
            Choose a JPG, PNG, or WebP image. Maximum file size: 5 MB.
          </span>

          <div className="avatar_editor_actions">
            <button
              type="button"
              className="avatar_upload"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className="avatar_remove"
              onClick={handleRemoveAvatar}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Name and email */}
      <div className="profile_edit_grid">
        <div className="auth_field">
          <label htmlFor="profile_edit_name">Your name</label>
          <input
            className="auth_input"
            id="profile_edit_name"
            type="text"
            autoComplete="name"
            minLength={2}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth_field">
          <label htmlFor="profile_edit_email">Email address</label>
          <input
            className="auth_input"
            id="profile_edit_email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="profile_error" role="alert">
          {error}
        </p>
      )}

      {/* Password section */}
      <div className="password_section">
        <h3>Change password</h3>
        <p>Enter your current password to set a new one.</p>

        <div className="profile_edit_grid">
          <div className="auth_field">
            <label htmlFor="current_password">Current password</label>
            <input
              className="auth_input"
              id="current_password"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="auth_field">
            <label htmlFor="new_password">New password</label>
            <input
              className="auth_input"
              id="new_password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="auth_field">
            <label htmlFor="confirm_password">Confirm new password</label>
            <input
              className="auth_input"
              id="confirm_password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <label className="password_toggle">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
          />
          Show passwords
        </label>

        {passwordError && (
          <p className="profile_error" role="alert">
            {passwordError}
          </p>
        )}

        {passwordSuccess && (
          <p className="profile_success" role="status">
            {passwordSuccess}
          </p>
        )}

        <button
          type="button"
          className="profile_change_password"
          onClick={handleChangePassword}
          disabled={passwordLoading}
        >
          {passwordLoading ? "Updating..." : "Change password"}
        </button>
      </div>

      {/* Profile actions */}
      <div className="profile_edit_actions">
        <button type="button" className="profile_cancel" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="profile_save">
          Save changes
        </button>
      </div>
    </form>
  );
}

export default ProfileEditForm;
