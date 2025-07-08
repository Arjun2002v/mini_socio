import React from "react";
import { useParams } from "react-router-dom";
import useApi from "./hooks/useSwr";

const Dash = () => {
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);
  console.log(" User data", data);
  return (
    <div>
      <p>Hi {id}</p>
    </div>
  );
};

export default Dash;
