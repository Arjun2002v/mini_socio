import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useApi from "./hooks/useSwr";

const socket = io("http://localhost:5000"); // ✅ Use your backend address

export const Chat = ({ setOpen }) => {
  const [text, settext] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useApi("/message");

  const [messages, setMessages] = useState([data]);
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const timestamp = 1753092158438; // your timestamp in ms
  const date = new Date(timestamp);

  // Convert to IST
  const istTime = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  //Function for sending and recieving messages

  //Function for for showing typing
  useEffect(() => {
    let timeout;

    const handleTypingStatus = (msg) => {
      setStatus(msg);

      // Clear any previous timeout
      if (timeout) clearTimeout(timeout);

      // Set a new timeout to clear typing indicator
      timeout = setTimeout(() => {
        setStatus("");
      }, 1000);
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
  const sendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          time: Date.now(),
          sender: decode?.name,
        }),
      });

      const message = await response.json();

      if (!response.ok) {
        console.error("Failed to send message:", message);
        return;
      }

      socket.emit("sendingMessage", message); // Broadcast to socket

      settext(""); // Clear the input
    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("receiveMessage", (msg) => {
      console.log("Recieved", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    console.log("Message", messages?.message, data);
  }, [messages, data]);

  return (
    <div className="flex items-center flex-col">
      <h2>Chat</h2>

      <div className="max-h-[400px] overflow-y-auto w-full flex  justify-center">
        <ul className="w-150 p-4 space-y-2">
          {data?.message?.map((msg, i) => {
            const isMe = decode?.name === msg?.sender;
            return (
              <div
                key={i}
                className={`flex flex-col max-w-[75%] rounded-xl m-2 px-2 py-1 ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                {!isMe && (
                  <p className="text-[12px] font-semibold text-gray-700 mb-1">
                    {msg?.sender}
                  </p>
                )}

                <div
                  className={`px-3 py-2 rounded-xl text-sm break-words ${
                    isMe
                      ? "bg-green-300 text-white rounded-br-none"
                      : "bg-blue-300 text-white rounded-bl-none shadow"
                  }`}
                >
                  <p>{msg?.text}</p>
                </div>

                <p className="text-xs text-gray-500">{istTime}</p>
              </div>
            );
          })}
        </ul>
      </div>

      {status && <p className="text-sm italic text-gray-500 px-2">{status}</p>}

      <div className="flex items-center gap-2 bg-white px-3 py-2 shadow-md rounded-full w-full max-w-[600px] mx-auto">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={handleTyping}
          className="flex-1 outline-none px-4 py-2 text-sm rounded-full bg-gray-100 focus:bg-white"
        />

        <button
          disabled={!text}
          onClick={sendMessage}
          className={`bg-green-400 hover:bg-green-600 text-white rounded-md p-1 w-20 h-10 flex items-center justify-center ${
            !text ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Send
        </button>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="cursor-pointer bg-red-400 p-2 rounded-md text-white mt-10  "
      >
        Cancel
      </button>
    </div>
  );
};
