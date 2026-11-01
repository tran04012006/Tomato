import "../styles/MainPage.css";
import useNavigation from "../hooks/useNavigation.js";
import { useApp } from "../Context/AppContext.jsx";

const userButton = () => {
  const { gotoProfile } = useNavigation();
  const { user } = useApp();
  console.log("di vao main page ", user);

  return (
    <>
      <button id="user_button" onClick={() => gotoProfile()}>
        {/* su dung span vi la inline */}
        <span id="user_button_avatar">
          {user?.username?.charAt(0).toUpperCase() || "G"}
        </span>
        <span id="user_button_name">{user?.username || "Guest"}</span>
      </button>
    </>
  );
};

export default userButton;
