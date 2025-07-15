import { useParams } from "react-router-dom";
import useApi from "./hooks/useSwr";
import toast, { Toaster } from "react-hot-toast";

const User = () => {
  const { id } = useParams();
  const { data: user } = useApi(`/users/${id}`);

  const follow = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/follows/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      toast.success("Follow Successful");
    } else {
      toast.error("Error Following ");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mt-30 gap-3">
        <>
          <div className="rounded-4xl w-10 h-10 bg-amber-700">
            {user?.details?.avatar ? (
              <img src={user?.details?.avatar} alt="" />
            ) : (
              <p className="font-medium text-white flex items-center justify-center mt-2">
                {user?.details?.name
                  ? user.details.name.charAt(0).toUpperCase() +
                    user.details.name.charAt(1).toLowerCase()
                  : ""}
              </p>
            )}
          </div>
          <p>{user?.details?.name}</p>
          <p>{user?.details?.bio}</p>
          <div className="flex  gap-4">
            <p>Followers: {user?.details?.followers?.length}</p>
            <p>Following: {user?.details?.following?.length}</p>
          </div>
          <p
            className="bg-blue-500 text-white font-medium p-3 rounded-md w-20 flex items-center justify-center cursor-pointer"
            onClick={() => follow(user?.details?._id)}
          >
            Follow
          </p>
        </>
      </div>
      <Toaster />
    </>
  );
};
export default User;
