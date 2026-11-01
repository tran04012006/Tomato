import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./Context/AppContext.jsx";

import "./styles/Variable.css";
import App from "./App.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ToastContainer position="top-right" autoClose={3000} />
//     <BrowserRouter>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="auth/login" element={<LoginPage />} />
//         <Route path="/forgot_password" element={<ForgotPassword />} />
//         <Route path="/main_page" element={<MainPage />} />

//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>,
// );
