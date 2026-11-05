import Header from "./pages/Header.jsx";
import Card from "./pages/Card.jsx";
import "./styles/pomato.css";
import "./styles/panel.css";
import { useEffect } from "react";
import socket from "./socket.js";

function App() {
  return (
    <>
      <Header />
      <Card />
    </>
  );
}

export default App;
