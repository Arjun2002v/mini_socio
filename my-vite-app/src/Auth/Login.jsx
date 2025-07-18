import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Topbar from "../Topbar";
import Spinner from "../Spinner";

const Login = () => {
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Signup successful", {
          duration: 5000,
          position: "bottom-center",
        });

        localStorage.setItem("token", data.token);
        navigate(`/dashboard/${data?.newUser?._id}`);
      } else {
        toast.error(data.message, {
          duration: 6000,
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error signing you up", {
        duration: 6000,
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <Topbar />
      <div className=" bg-brown h-[100vh] w-full flex   items-center justify-center">
        <div className="flex justify-center flex-col gap-4  ">
          <div className="flex flex-col justify-center align-center border-white border-1">
            <input
              type="text"
              className="border-black border-1"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="border-black border-1"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={submit}
              className="cursor-pointer flex justify-center font-bold bg-green-700 w-22 rounded-md p-2 text-white"
            >
              Sign In
            </button>
          </div>
          <Toaster />
          {loading && <Spinner />}
        </div>
      </div>
    </>
  );
};

export default Login;
