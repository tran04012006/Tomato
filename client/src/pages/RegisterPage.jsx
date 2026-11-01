import "../styles/AuthLayout.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import useNavigation from "../hooks/useNavigation";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/AppContext.jsx";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const { goToMainPage } = useNavigation();
  const { setUser } = useApp();
  const handleRegister = async (username, password, email) => {
    console.log("chay handleRegister ");
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        {
          username: username,
          password: password,
          email: email,
        },
        {
          withCredentials: true,
        },
      );
      console.log(res.data.message);
      setMessage(res.data.message);

      if (res.status == 201) {
        setUser(res.data.data);

        goToMainPage();
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response?.status == 400 || error.response?.status == 409)
        toast.error(error.response?.data?.message);
      console.log(error.response?.data?.message);

      setMessage(error.response?.data?.message);

      if (error.response?.status == 409) {
        goToMainPage();
      }
    }
  };

  return (
    <AuthLayout
      login={true}
      forgotPassword={false}
      register={true}
      kicker="Plant your first seed"
      title="Create your Todoro"
      submit_content="Create my account"
      authSwitch_text="Already growing with us? "
      authSwitch_linkText="Sign in."
      setUsername={setUsername}
      setMessage={setMessage}
      setPassword={setPassword}
      setEmail={setEmail}
      handle={() => handleRegister(username, password, email)}
    />
  );
}

export default RegisterPage;
