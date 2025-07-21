import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Use your backend address

export const Chat = () => {
  const [text, settext] = useState("");
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  //Function for sending and recieving messages
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

  //Function for for showing typing
  useEffect(() => {
    let timeout;

    const handleTypingStatus = (msg) => {
      console.log("Typingsdada", msg);
      setStatus(msg);

      // Clear any previous timeout
      if (timeout) clearTimeout(timeout);

      // Set a new timeout to clear typing indicator
      timeout = setTimeout(() => {
        setStatus("");
      }, 1500);
    };

    socket.on("typing", handleTypingStatus);

    return () => {
      socket.off("typing", handleTypingStatus);
      clearTimeout(timeout); // Clear timeout on unmount
    };
  }, []);

  const handleTyping = (e) => {
    settext(e.target.value);

    socket.emit("typing", decode?.name); // you sending your name
  };

  const sendMessage = () => {
    socket.emit("sendMessage", {
      text: text,
      sender: decode.name,
    });

    settext("");
  };

  return (
    <div className="flex items-center flex-col">
      <h2>Chat</h2>

      <ul className=" w-150 p-4 space-y-2">
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
                    ? "bg-green-400  rounded-br-none"
                    : "bg-blue-400 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg?.text}</p>
              </div>
            </div>
          );
        })}
        {status && (
          <p className="text-sm italic text-gray-500 px-2">{status}</p>
        )}
      </ul>

      <div className="flex gap-2">
        {" "}
        <input
          placeholder="Type your thoughts"
          value={text}
          onChange={handleTyping}
          className="border-black border-1 rounded-md flex items-center justify-center p-2 h-8"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white rounded-md p-3 w-14 h-8 flex items-center cursor-pointer "
        >
          Send
        </button>
      </div>
    </div>
  );
};
