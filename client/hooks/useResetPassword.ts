import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";

import apiClient from "@/api/index";

const resetPassword = async (data: { email: string; password: string }) => {
  try {
    console.log(data);

    const res = await apiClient.post(`/users/resetPassword`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.message);
    throw error; // MUST throw so React Query catches it
  }
};

const useResetPassword = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: async (data) => {
      router.replace("/sign-in");
    },
  });
  return mutation;
};
export default useResetPassword;
