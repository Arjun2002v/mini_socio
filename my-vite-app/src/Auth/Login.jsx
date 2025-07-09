import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [name, setName] = useState();

  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const submit = async () => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      console.log("DADADA", response.ok);

      if (response.ok) {
        toast.success("Signup successful", {
          duration: 5000,
          position: "bottom-right",
        });

        localStorage.setItem("token", data.token);
        navigate(`/dashboard/${data?.newUser?._id}`);
      } else {
        toast.error(data.message, {
          duration: 5000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error signing you up", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <div className=" bg-brown h-[100vh] w-full ">
        <div className="flex justify-center  ">
          <div className="flex flex-col justify-center align-center border-white border-1">
            <p>Sign In</p>

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
            <button onClick={submit} className="cursor-pointer">
              Sign In
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </>
  );
};

export default Login;
