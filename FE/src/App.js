import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ConnectionState } from "./components/ConnectionState";
import RecordForm from "./components/RecordForm";
import Records from "./components/Records";
import { socket } from "./socket";

import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="container px-5 mx-auto">
      <NavBar />
      <ConnectionState isConnected={isConnected} />
      <Routes>
        <Route path="/" element={<Records socket={socket} />} />
        <Route path="/create" element={<RecordForm socket={socket} />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
