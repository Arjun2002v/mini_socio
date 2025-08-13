import React from "react";

import { Toaster } from "react-hot-toast";

import Profile from "./Profile";

export const Topbar = () => {
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
