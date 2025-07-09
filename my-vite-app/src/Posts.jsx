import React from "react";
import useApi from "./hooks/useSwr";
import Topbar from "./Topbar";
import { jwtDecode } from "jwt-decode";

export const Posts = () => {
  const { data: posts } = useApi("/posts");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  return (
    <>
      <Topbar />
      <div className="flex flex-col gap-5  ">
        <p className="text-4xl">Posts for you to read </p>
        {posts?.data?.map((item) => (
          <div className="flex gap-2 items-center">
            <p>{item?.content}</p>
            {item?.createdBy?.name === decoded?.name ? (
              <button
                className="bg-red-600  cursor-pointer
             p-1 flex items-center justify-center w-20 text-white font-bold rounded-md"
              >
                Delete
              </button>
            ) : (
              ""
            )}
          </div>
        ))}{" "}
      </div>
    </>
  );
};

export default Posts;
