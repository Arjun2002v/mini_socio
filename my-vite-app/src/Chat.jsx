import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [send, setSend] = useState([]);
  const socket = io("http://localhost:5000");

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setSend((prev) => [...prev, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };
  return (
    <div>
      <div>
        {send.map((item) => (
          <>
            <p>{item}</p>
          </>
        ))}
      </div>
      <input
        type="text"
        className="border-1 border-black "
        placeholder="Shut Up and type"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button
        className="p-3 bg-green-400 font-bold text-white rounded-md w-20 text-[14px] cursor-pointer"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};
