import React from "react";
import useApi from "./hooks/useSwr";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const Topbar = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);
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
      <div className="flex  gap-5  items-center justify-end pr-4">
        <p>{data?.details?.name}</p>
        <button
          onClick={LogOut}
          className="cursor-pointer font-bold bg-blue-500 w-22 rounded-md p-2 text-white"
        >
          Sign Out
        </button>
      </div>
      <Toaster />
    </>
  );
};
export default Topbar;
