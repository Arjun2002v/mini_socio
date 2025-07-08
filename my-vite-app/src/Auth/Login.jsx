import React, { useEffect, useState } from "react";
import Dash from "../Dash";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState();
  const [user, setUser] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState("");

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

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
      } else {
        setMessage("Signup successful!");

        localStorage.setItem("token", data.token);
      }
      console.log("API data:", data?.newUser); // ✅ confirm data here
      setUser(data?.newUser);

      navigate(`/dashboard/${data?.newUser?._id}`);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred");
    }
    console.log("user", user?.name);
  };
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);
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
            <button onClick={submit}>Sign In</button>
          </div>
          {message}
        </div>
      </div>
      <Dash />
    </>
  );
};

export default Login;
