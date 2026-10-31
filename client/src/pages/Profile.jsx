import "../styles/Profile.css";
import { useState } from "react";
import { useApp } from "../Context/AppContext.jsx";

const Profile = () => {
  //thong tin nguoi dung hien tai
  // const [user, setUser] = {
  //   name: "Ngo Bich Tran",
  //   email: "bichtran@gmail.com",
  // };

  //trang thai edit hay ko
  const [isEditing, setIsEditing] = useState(false);

  // thong tin dang duoc chinh sua
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const { user } = useApp();

  return (
    <>
      <div id="profile_card">
        <div id="profile_cover">
          <h1>User information</h1>
        </div>
        <div id="profile_identity">
          <div id="profile_avatar">
            {user?.username?.charAt(0).toUpperCase() || "G"}
          </div>
          <div id="profile_name">
            <strong id="user_fullname">{user?.username || "Guest"}</strong>
            <span>{user?.email || ""}</span>
          </div>
        </div>

      <div></div>

        {isEditing === false && (
          <button id="profile_edit_button" onClick={handleEditProfile}>
            Edit profile
          </button>
        )}
        {isEditing === true && (
          <form id="profile_edit_form">
            <div id="profile_edit_heading">Update your information</div>
            <div
              id="avatar_editor"
              style={
                formData.avatar
                  ? { backgroundImage: `url("${fsormData.avatar}")` }
                  : {}
              }
            ></div>

            <div id="profile_edit_field">
              <label htmlFor="profile_edit_name">Your name</label>
              <input type="text" required id="profile_edit_name" />

              <label htmlFor="profile_edit_email">Email address</label>
              <input type="text" required id="profile_edit_name" />

              <label htmlFor="profile_edit_password">Password</label>
              <input type="password" required id="profile_edit_password" />
            </div>
          </form>
        )}
      </div>
    </>
  );
};
export default Profile;
