import { useNavigate, useParams } from "react-router-dom";
import useApi from "./hooks/useSwr";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Topbar from "./Topbar";
import { Chat } from "./Chat";
import { jwtDecode } from "jwt-decode";
import { Follow } from "./Follow";

const Dash = () => {
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);
  console.log("data", data);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [active, setActive] = useState(false);

  const [open, setOpen] = useState("false");

  const [post, setPost] = useState("");
  const [select, setFile] = useState(null);

  const nav = useNavigate();

  const submit = async (id) => {
    const response = await fetch("http://localhost:5001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: post, userId: id }),
    });
    if (response.ok) {
      toast.success("Post created successfully");
      setPost("");
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

    const form = new FormData();
    form.append("file", select);

    await fetch("http://localhost:5001/upload", {
      method: "POST",
      body: form, // send FormData directly
      // ❌ DO NOT set Content-Type here, let the browser set it
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const handleFileChange = (e) => {
    setFile(e.target.file[0]);
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
                onChange={handleFileChange} // update state on file selection
              />
              <button onClick={handleFile}>Upload</button>{" "}
              {/* trigger upload */}
            </div>

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
