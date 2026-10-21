import InputField from "../components/InputField";
import AuthSwitch from "../components/AuthSwitch";
import "../styles/AuthLayout.css";
import { Link } from "react-router-dom";

const AuthLayout = (props) => {
  return (
    <>
      <div id="main">
        <div id="left">
          <div id="brand_name">Todoro</div>
          <div id="kicker">{props.kicker}</div>
          <h1>{props.title}</h1>
          {props.forgotPassword == true && (
            <div id="text">
              {props.note}
              <div id="recovery_progress">
                <div className="recovery recovery_step1 active"></div>
                <div
                  className={`recovery recovery_step2 ${props.step_two ? "active" : ""}`}
                ></div>
              </div>
            </div>
          )}
          <div id="userInput">
            {props.register == true && (
              <InputField
                label="Username"
                type="text"
                id="username"
                placeholder="What should we call you?"
                onChange={(e) => props.setUsername(e.target.value)}
                required
              />
            )}

            <InputField
              label="Email"
              type="email"
              id="email"
              placeholder="Your email"
              onChange={(e) => props.setEmail(e.target.value)}
              required
            />
            {props.forgotPassword === false && (
              <InputField
                label="Password"
                type="password"
                id="password"
                placeholder="At least 6 characters"
                onChange={(e) => props.setPassword(e.target.value)}
                required
              />
            )}
          </div>

          {props.login === true && (
            <Link to="/forgot_password" id="forgot_password">
              Forgot password?
            </Link>
          )}
          <button id="registerBtn" onClick={props.handleRegister}>
            {props.submit_content}
          </button>
          <AuthSwitch
            text={props.authSwitch_text}
            linkText={props.authSwitch_linkText}
          />
        </div>
        <div id="right">
          <div id="tomato">
            <div id="tomato_orbit"></div>
            <div id="big_tomato"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
