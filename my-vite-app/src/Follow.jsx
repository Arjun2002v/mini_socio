import React from "react";
import useApi from "./hooks/useSwr";
import { useParams } from "react-router-dom";

export const Follow = () => {
  const { id } = useParams();
  const { data: user } = useApi(`/users/${id}`);

  return (
    <div>
      <p>Lets Chat</p>
      <div className="flex gap-4 justify-start items-center">
        <div className="rounded-full flex items-center justify-center w-10 h-10 bg-amber-700">
          {user?.details?.avatar ? (
            <img src={user?.details?.avatar} alt="" />
          ) : (
            <p className="font-medium text-white flex items-center justify-center ">
              {user?.details?.name
                ? user.details.name.charAt(0).toUpperCase() +
                  user.details.name.charAt(1).toLowerCase()
                : ""}
            </p>
          )}
        </div>
        <p className="font-bold">{user?.details?.name}</p>
      </div>

      <button>Close</button>
    </div>
  );
};

export default Follow;
