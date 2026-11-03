import { useNavigate } from "react-router-dom";

const useNavigation = () => {
  const navigate = useNavigate();

  const goToMainPage = () => navigate("/");
  const gotoProfile = () => navigate("/profile");
  const gotoRegisterPage = () => navigate("/auth/register");
  const gotoLoginPage = () => navigate("/auth/login");

  return { goToMainPage, gotoProfile, gotoRegisterPage, gotoLoginPage };
};

export default useNavigation;
