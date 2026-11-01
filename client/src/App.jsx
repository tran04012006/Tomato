import LoginPage from "../src/pages/LoginPage";
// import ForgotPassword from "../src/pages/ForgotPassword";
import MainPage from "./pages/MainPage.jsx";
// import Profile from "./pages/Profile.jsx";
import { Routes, Route } from "react-router-dom";
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
      <Route
        path="/"
        element={user ? <MainPage /> : <Navigate to="/auth/login" replace />}
      />
    </Routes>
  );
};

export default App;
