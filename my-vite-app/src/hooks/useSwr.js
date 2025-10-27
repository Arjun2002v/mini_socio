import useSWR from "swr";
import fetcher from "./fetcher";

export default function useApi(url) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
