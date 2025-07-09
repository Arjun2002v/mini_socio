import React from "react";
import useApi from "./hooks/useSwr";

export const Posts = () => {
  const { data: posts } = useApi("/posts");

  return (
    <>
      <div className="flex flex-col ">
        <p className="text-4xl">Posts for you to read </p>
        {posts?.data.map((item) => (
          <div className="">
            <p>{item?.content}</p>
          </div>
        ))}{" "}
      </div>
    </>
  );
};
