import "../styles/login.css";
import TomatoArt from "../components/TomatoArt";
import axios from "axios";
import { useState } from "react";

function InputField({ label, type, id, placeholder, onChange }) {
  return (
    <div className="userInfo">
      <label htmlFor={id}>{label}</label>
      <br />
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="userInput"
        onChange={onChange}
      />
    </div>
  );
}

const handleRegister = async (event, username, password) => {
  try {
    const res = await axios.post("http://localhost:3000/Register", {
      username: username,
      password: password,
    });
    console.log(res.data.message);

    alert(res.data.message);
  } catch (error) {
    alert(error.response.data.message);
  }
};

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <div id="header">
        <div id="acount_dialog">
          <h2>Welcome, homie.</h2>

          <div id="account_form">
            <InputField
              label="Username"
              type="text"
              id="userName"
              placeholder="What should we call you?"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <InputField
              label="Password"
              type="password"
              id="userPassword"
              placeholder="Enter your password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />

            <button
              id="submit_btn"
              onClick={(event) => handleRegister(event, username, password)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
