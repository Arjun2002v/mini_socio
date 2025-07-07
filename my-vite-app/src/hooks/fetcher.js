const fetcher = async (url) => {
  const apiUrl = `http://localhost:5000${url}`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  if (!res.ok) {
    const error = new Error("Error fetching data");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default fetcher;
