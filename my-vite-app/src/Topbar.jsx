import React from "react";
import useApi from "./hooks/useSwr";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export const Topbar = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);

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
      <div className="flex  gap-5  items-center justify-end pr-4 mt-5">
        <p>{data?.details?.name}</p>
        <div className="flex gap-2">
          <div
            className="rounded-4xl w-10 h-10 bg-amber-700 cursor-pointer"
            onClick={() => nav(`/home/user/${decoded?._id}`)}
          >
            {data?.details?.avatar ? (
              <img src={data?.details?.avatar} alt="" />
            ) : (
              <p className="font-medium text-white flex items-center justify-center mt-2">
                {decoded?.name
                  ? decoded?.name.charAt(0).toUpperCase() +
                    decoded?.name.charAt(1).toLowerCase()
                  : ""}
              </p>
            )}
          </div>
          <button
            onClick={LogOut}
            className="cursor-pointer font-bold bg-black w-22 rounded-md p-2 text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
      <Toaster />
    </>
  );
};
export default Topbar;
