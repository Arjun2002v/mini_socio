import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Use your backend address

export const Chat = () => {
  const [text, settext] = useState("");
  const [textStatus, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    socket.on("showTyping", (msg) => {
      setStatus(msg);
    });
    setTimeout(() => {
      setStatus("");
    }, 2000);

    return () => {
      socket.off("showTyping");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sendMessage", {
      text: text,
      sender: decode.name, // Assuming decode.name is your username
    });

    settext("");
  };

  useEffect(() => {
    console.log("Datass", messages);
  }, [messages]);
  console.log("User", decode);
  return (
    <div className="flex items-center flex-col">
      <h2>Chat</h2>
      <ul className=" w-full p-4 space-y-2">
        {messages?.map((msg, i) => {
          const isMe = decode.name === msg?.sender;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-xs break-words rounded-lg text-white ${
                  isMe
                    ? "bg-green-500 rounded-br-none"
                    : "bg-blue-400 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg?.text}</p>
              </div>
            </div>
          );
        })}
      </ul>

      <input value={text} onChange={(e) => settext(e.target.value)} />
      {textStatus ? <p> Typing...</p> : <></>}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
