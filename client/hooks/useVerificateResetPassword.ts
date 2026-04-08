import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";

import apiClient from "@/api/index";

const verificateResetPassword = async (data: {
  email: string;
  otp: string;
}) => {
  try {
    const res = await apiClient.post(`/users/verifyResetPassword`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.response?.data);
    throw error; // MUST throw so React Query catches it
  }
};

const useVerificateResetPassword = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: verificateResetPassword,
    // onMutate: () => setLoading(true),
    onSuccess: async (data) => {
      console.log("user Verified");
      console.log(data);

      //   signIn(token);
      //   router.replace("/");
      console.log("resetPassword");

      router.replace("/resetPassword");
    },
    onError: (error: any) => {
      router.push("/");

      console.log("❌ Server Error:", error.response?.data);
    },
  });
  return mutation;
};
export default useVerificateResetPassword;
