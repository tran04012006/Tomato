import "../styles/Profile.css";
import { useState, useRef } from "react";
import { useApp } from "../Context/AppContext.jsx";
import ProfileGrid from "../components/ProfileGrid.jsx";
import ProfileEditForm from "../components/ProfileEditForm.jsx";
import useNavigation from "../hooks/useNavigation.js";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import axios from "axios";
const Profile = () => {
  //thong tin nguoi dung hien tai
  const { gotoLoginPage } = useNavigation();
  //trang thai edit hay ko
  const [isEditing, setIsEditing] = useState(false);

  // thong tin dang duoc chinh sua
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const fileInputRef = useRef(null);

  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const { user, setUser } = useApp();

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const response = await api.put("/auth/profile", {
        username: updatedData.name,
        email: updatedData.email,
        avatar: updatedData.avatar,
      });

      if (response.status === 200) {
        const updatedUser = response.data.data.user;

        setUser(updatedUser);

        setIsEditing(false);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update profile failed:", error);

      toast.error(
        error.response?.data?.message || "Could not update your profile",
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});

      setUser(null);

      gotoLoginPage();

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to log out");
    }
  };

  const initials = user.name ? user.name : "G";

  return (
    <>
      <div id="profile_card">
        <div id="profile_cover">
          <h1>User information</h1>
        </div>
        <div id="profile_identity">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile avatar"
                className="profile-avatar-image"
              />
            ) : (
              <span>{(user?.username || "G").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div id="profile_name">
            <strong id="user_fullname">{user?.username || "Guest"}</strong>
            <span>{user?.email || ""}</span>
          </div>
        </div>

        <div></div>
        <ProfileGrid />

        {isEditing === false && (
          <button id="profile_edit_button" onClick={handleEditProfile}>
            Edit profile
          </button>
        )}
        {isEditing && (
          <ProfileEditForm
            user={{
              ...user,
              name: user.username ?? "",
              email: user.email ?? "",
              avatar: user.avatar ?? "",
            }}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        )}
        <button id="log_out" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </>
  );
};
export default Profile;
