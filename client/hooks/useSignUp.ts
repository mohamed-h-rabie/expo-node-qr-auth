import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import apiClient from "@/api/index";

const signUp = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await apiClient.post(`/users/signUp`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.message);
    throw error; // MUST throw so React Query catches it
  }
};

const useSignUp = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: async (data) => {
      console.log("user Registered");
      const email = data.data.email;
      console.log(email, "rabie");
      // if (Platform.OS === "web") {
      //   localStorage.setItem("email", email);
      // }
      await SecureStore.setItemAsync("email", email);
      router.replace("/verification");
    },
  });
  return mutation;
};
export default useSignUp;
