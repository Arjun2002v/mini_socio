import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const Profile = () => {
  const token = localStorage.getItem("token");
  let decoded = {};

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-4xl w-10 h-10 bg-amber-700 cursor-pointer flex items-center justify-center"
        onClick={() => setOpen(!open)}
      >
        {decoded.avatar ? (
          <img
            src={decoded.avatar}
            alt="avatar"
            className="w-full h-full object-cover rounded-4xl"
          />
        ) : (
          <p className="font-medium text-white text-lg">
            {decoded.name
              ? decoded.name.charAt(0).toUpperCase() +
                decoded.name.charAt(1).toLowerCase()
              : ""}
          </p>
        )}
      </div>

      {open && (
        <div
          className="flex flex-col items-center mt-4 gap-3 bg-white p-3 shadow-md rounded"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload(); // Optional: refresh on logout
          }}
        >
          <button className="text-red-600 font-semibold">Sign Out</button>
        </div>
      )}
    </>
  );
};

export default Profile;
