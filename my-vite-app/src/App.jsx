import React, { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "./hooks/fetcher";

const App = () => {
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState("");

  const { data } = useSWR("/users", fetcher);

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
        console.log("Token:", data.token);
        // Optionally store token in localStorage or navigate to dashboard
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred");
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
            <button onClick={submit}>Sign In</button>
          </div>
          {message}
        </div>
      </div>
    </>
  );
};

export default App;
