import "../styles/AuthLayout.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";

import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async (username, password, email) => {
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

      if (res.status == 201) toast.success(res.data.message);
    } catch (error) {
      if (error.response?.status == 400 || error.response?.status == 409)
        toast.error(error.response?.data?.message);
      console.log(error.response?.data?.message);

      setMessage(error.response?.data?.message);
    }
  };

  return (
    <AuthLayout
      login={true}
      forgotPassword={false}
      register={true}
      kicker="Plant your first seed "
      title="Create your Todoro"
      submit_content="Create my account"
      authSwitch_text="Already growing with us? "
      authSwitch_linkText="Sign in."
      setUsername={setUsername}
      setMessage={setMessage}
      setPassword={setPassword}
      setEmail={setEmail}
      handleRegister={() => handleRegister(username, password, email)}
    />
  );
}

export default RegisterPage;
