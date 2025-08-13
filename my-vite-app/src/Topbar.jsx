import React from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Profile from "./Profile";

export const Topbar = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const LogOut = () => {
    if (!token) {
      return null;
    } else {
      localStorage.removeItem("token");
    }

    nav("/signup");
    toast.success("Logout successful", { position: "bottom-center" });
  };

  return (
    <>
      <div className="flex  gap-5  items-center justify-end pr-4 mt-5 bg-black">
        <div className="flex gap-2">
          <Profile />
        </div>
      </div>
      <Toaster />
    </>
  );
};
export default Topbar;
