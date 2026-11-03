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
