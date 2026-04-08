import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import apiClient from "@/api/index";

const forgetPassword = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(`/users/forgetPassword`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error);
    throw error; // MUST throw so React Query catches it
  }
};

const useForgetPassword = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: forgetPassword,
    onSuccess: async (data) => {
      console.log("Check your email");
      const email = data.email;
      console.log(email, "rabie");
      await SecureStore.setItemAsync("email", email);
      router.replace("/verification?type=resetPassword");
    },
  });
  return mutation;
};
export default useForgetPassword;
