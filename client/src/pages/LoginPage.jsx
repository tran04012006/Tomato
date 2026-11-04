import "../styles/AuthLayout.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import "react-toastify/dist/ReactToastify.css";
import useNavigation from "../hooks/useNavigation.js";
import { useApp } from "../Context/AppContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { goToMainPage } = useNavigation();
  const { setUser } = useApp();
  const { gotoRegisterPage } = useNavigation();
  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(res.data.message);
      setMessage(res.data.message);

      if (res.status == 200) {
        toast.success(res.data.message);
        console.log(res.data.data.username);
        setUser(res.data.data);
        console.log("go to main page");
        goToMainPage();
      }
    } catch (error) {
      if (
        error.response?.status == 400 ||
        error.response?.status == 409 ||
        error.response?.status == 404 ||
        error.response?.status == 401
      )
        toast.error(error.response?.data?.message);
      setMessage(error.response?.data?.message);

      if (error.response?.status == 401) {
        console.log("dieu huong sang register");
        gotoRegisterPage();
      }
    }
  };

  return (
    <AuthLayout
      login={true}
      register={false}
      forgotPassword={false}
      forgotPassword_step2={false}
      kicker="Welcome back, bestie! "
      title="Ready to grow today?"
      submit_content="Enter my study space"
      authSwitch_text="New to the garden? "
      authSwitch_linkText="Create an account."
      setMessage={setMessage}
      setPassword={setPassword}
      setEmail={setEmail}
      handle={() => handleLogin(email, password)}
    />
  );
}

export default LoginPage;
