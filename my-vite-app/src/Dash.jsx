import { useParams } from "react-router-dom";
import useApi from "./hooks/useSwr";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Dash = () => {
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);
  const { posts } = useApi(`/posts/users//${id}`);
  const [active, setActive] = useState(false);

  const [post, setPost] = useState("");
  console.log("Post data:", posts);

  const submit = async (id) => {
    const response = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: post, userId: id }),
    });
    if (response.ok) {
      toast.success("Post created successfully");
      setPost("");
    } else {
      toast.error("Post creation failed");
    }
    await response.json();
  };

  return (
    <div>
      <p>Hi {data?.details?.name} Welcome to Mini_social</p>
      <div className="flex flex-col gap-2">
        <button onClick={() => setActive(!active)} className="cursor-pointer">
          New Post
        </button>
        {active ? (
          <>
            <input
              type="text"
              placeholder="Write your thought...."
              onChange={(e) => setPost(e.target.value)}
              value={post}
            />
            {/* <div className="mb-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                Add Pictures
              </label>
              <input
                id="file-upload"
                multiple
                type="file"
                className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
              />
            </div> */}

            <div
              className="bg-blue-600 text-white w-40 flex justify-center rounded-2xl cursor-pointer p-2"
              onClick={() => submit(id)}
            >
              Create New Post
            </div>
            <Toaster />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Dash;
