import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/index";

const fetchMe = async (token: string) => {
  try {
    const res = await apiClient.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.response?.data);
    throw error;
  }
};

const useGetMe = (token?: string | null) => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => fetchMe(token!),
    enabled: !!token,
  });
};

export default useGetMe;
