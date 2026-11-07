import Header from "./pages/Header.jsx";
import Card from "./pages/Card.jsx";
import "./styles/pomato.css";
import "./styles/panel.css";
import socket from "./socket.js";
import LoginPage from "../src/pages/LoginPage";
// import ForgotPassword from "../src/pages/ForgotPassword";
import MainPage from "./pages/MainPage.jsx";
import Profile from "./pages/Profile.jsx";
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
    <>
      <Header />
      <Card />
      <Routes>
        {/* register */}
        <Route
          path="/auth/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />{" "}
        {/* login */}
        <Route
          path="/auth/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        {/* main page */}
        <Route
          path="/"
          element={user ? <MainPage /> : <Navigate to="/auth/login" replace />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/"
          element={
            user ? <MainPage /> : <Navigate to="/auth/register" replace />
          }
        />
      </Routes>
    </>
  );
};

export default App;
