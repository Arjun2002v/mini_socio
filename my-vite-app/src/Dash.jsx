import { useNavigate, useParams } from "react-router-dom";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Topbar from "./Topbar";

import { jwtDecode } from "jwt-decode";
import { Follow } from "./Follow";

const Dash = () => {
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [active, setActive] = useState(false);

  const [open, setOpen] = useState("false");
  const [posts, setPosts] = useState([]);

  const [post, setPost] = useState("");

  const nav = useNavigate();

  const [select, setFile] = useState([]);

  const submit = async () => {
    const form = new FormData();

    form.append("content", post);
    form.append("userId", decoded?._id);

    // Append all selected files
    for (let i = 0; i < select.length; i++) {
      form.append("images", select[i]);
    }

    const response = await fetch("http://localhost:5001/posts", {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      toast.success("Post created successfully");
      setPost("");
      setFile([]);
      nav("/home/posts");
    } else {
      toast.error("Post creation failed");
    }

    await response.json();
  };

  const handleFile = async () => {
    if (!select) {
      alert("Please select a file");
      return;
    }
  };

  const handleFileChange = (e) => {
    setFile(Array.from(e.target.files));
    const files = Array.from(e.target.files);

    const imagesPreview = files.map((item) => ({
      item,
      pre: URL.createObjectURL(item),
    }));
    setPosts((prev) => [...prev, ...imagesPreview]);
  };

  return (
    <div className="bg-black">
      <Topbar />
      <p>Hi {decoded?.name} Welcome to Mini_social</p>
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
            <div className="mb-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                Add Pictures
              </label>
              <input
                id="file-upload"
                type="file"
                className="left-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
              <button onClick={handleFile}>Upload</button>{" "}
            </div>
            {posts?.map((item) => (
              <>
                <div className="flex justify-center gap-4 items-center border-1 border-white w-fit p-4 rounded-md">
                  <img
                    src={item?.pre}
                    alt={item?.file?.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </>
            ))}

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
      <p onClick={() => setOpen("true")}>Lets Chat</p>
      {open && open === "true" ? <Follow setOpen={setOpen} /> : <></>}
    </div>
  );
};

export default Dash;
