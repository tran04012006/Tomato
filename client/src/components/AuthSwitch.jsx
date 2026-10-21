import React from "react";
import "../styles/AuthSwitch.css";
import { Link } from "react-router-dom";

function AuthSwitch(props) {
  return (
    <div id="authSwitch">
      <div className="t text">
        {props.text}
        {props.linkText === "Sign in." && (
          <Link to="auth/login" id="linkText">
            {props.linkText}
          </Link>
        )}

        {props.linkText === "Create an account." && (
          <Link to="/" id="linkText">
            {props.linkText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default AuthSwitch;
