import React, { useState } from "react";
import useApi from "./hooks/useSwr";
import Topbar from "./Topbar";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const Posts = () => {
  const { data: posts } = useApi("/posts");
  const [openEdit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const [newpost, newsetPosts] = useState(posts?.data);

  const liked = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/posts/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("user", id);

    newsetPosts((prev) =>
      prev?.map((item) =>
        item?._id === id ? { ...item, likes: data?.likes } : item
      )
    );
  };
  useEffect(() => {
    if (posts?.data) {
      newsetPosts(posts.data);
    }
  }, [posts]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const Delete = (id) => {
    0;
    console.log("UserId", id);
    const response = fetch(`http://localhost:5000/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      toast.success("Deleted Successfully");
    }
  };
  const edit = (id) => {
    console.log("UserId", id);
    const response = fetch(`http://localhost:5000/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });
    if (response) {
      toast.success("Edit Done Successfully !!");
    }
  };

  return (
    <>
      <Topbar />
      <div className="flex flex-col gap-5  ">
        <p className="text-4xl">Posts for you to read </p>
        {newpost?.map((item) => (
          <div className="flex gap-2 items-center">
            <p>{item?.content}</p>
            {item?.createdBy?.name === decoded?.name ? (
              <>
                {" "}
                <button
                  className="bg-red-600  cursor-pointer
           p-1 flex items-center justify-center w-20 text-white font-bold rounded-md "
                  onClick={() => Delete(item?._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-500  cursor-pointer
           p-1 flex items-center justify-center w-20 text-white font-bold rounded-md "
                  onClick={() => setEdit(!openEdit)}
                >
                  Edit
                </button>
                {openEdit && (
                  <div>
                    {" "}
                    <input
                      type="text"
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                      placeholder="Edit your text"
                      className="border-2 border-black"
                    />
                    <button
                      className="bg-gray-500  cursor-pointer
           p-1 flex items-center justify-center w-20 text-white font-bold rounded-md "
                      onClick={() => edit(item?._id)}
                    >
                      Modify
                    </button>
                  </div>
                )}
              </>
            ) : (
              ""
            )}
            <div onClick={() => liked(item?._id, "liked")}>
              {" "}
              ❤ {item?.likes?.length}
            </div>
          </div>
        ))}{" "}
      </div>
    </>
  );
};

export default Posts;
