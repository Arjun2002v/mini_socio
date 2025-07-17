import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Use your backend address

export const Chat = () => {
  const [text, settext] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", text);
    settext("");
  };

  useEffect(() => {
    console.log("Data", messages);
  }, [messages]);
  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <input value={text} onChange={(e) => settext(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
