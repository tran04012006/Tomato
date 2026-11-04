import LoginPage from "../src/pages/LoginPage";
// import ForgotPassword from "../src/pages/ForgotPassword";
import MainPage from "./pages/MainPage.jsx";
<<<<<<< HEAD
=======
import Profile from "./pages/Profile.jsx";
>>>>>>> feature/profile
import Register from "./pages/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "./Context/AppContext.jsx";
import { Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
const App = () => {
  const { user, loading } = useApp();
  console.log("user trong app la: ", user);

  if (loading === true) {
    return <p>Loading...</p>;
  }
  return (
    <Routes>
      {/* register */}
      <Route
        path="/auth/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />{" "}
<<<<<<< HEAD
      <Route
        path="/"
        element={user ? <MainPage /> : <Navigate to="/auth/register" replace />}
      />
=======
>>>>>>> feature/profile
      {/* login */}
      <Route
        path="/auth/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
<<<<<<< HEAD
=======
      {/* forgot password */}
      {/* <Route path="/forgot_password" element={<ForgotPassword />} /> */}
>>>>>>> feature/profile
      {/* main page */}
      <Route
        path="/"
        element={user ? <MainPage /> : <Navigate to="/auth/login" replace />}
      />
<<<<<<< HEAD
=======
      <Route path="/profile" element={<Profile />} />
>>>>>>> feature/profile
    </Routes>
  );
};

export default App;
