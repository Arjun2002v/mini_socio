import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

export const Notification = () => {
  const socket = io("http://localhost:5001");

  useEffect(() => {
    socket.connect("connect", () => {
      console.log("Connection Secure", socket.id);
    });

    socket.on("getNotification", (data) => {
      setNotification(data.message);
    });
    toast.success("");
  }, []);

  const [notification, setNotification] = useState();
  return (
    <>
      <div>
        {notification && (
          <div className="fixed top-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg">
            {notification}
          </div>
        )}
      </div>
    </>
  );
};
