import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";

import apiClient from "@/api/index";

const resendCode = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(`/users/requestNewOTP`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.response?.data);
    throw error; // MUST throw so React Query catches it
  }
};

const userResendOTP = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: resendCode,
    // onMutate: () => setLoading(true),
    onSuccess: async () => {
      console.log("OTP Resended");
    },
    // onError: (error: any) => {
    //   console.log("❌ Server Error:", error.response?.data);
    // },
  });
  return mutation;
};
export default userResendOTP;
