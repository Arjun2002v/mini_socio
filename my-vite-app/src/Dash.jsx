import { useParams } from "react-router-dom";
import useApi from "./hooks/useSwr";

const Dash = () => {
  const { id } = useParams();
  const { data } = useApi(`/users/${id}`);

  return (
    <div>
      <p>Hi {data?.details?.name} Welcome to Mini_social</p>
    </div>
  );
};

export default Dash;
