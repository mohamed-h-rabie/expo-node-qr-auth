import { useMutation } from "@tanstack/react-query";

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

const useResendOTP = () => {
  const mutation = useMutation({
    mutationFn: resendCode,
    onSuccess: async () => {
      console.log("OTP Resended");
    },
  });
  return mutation;
};
export default useResendOTP;
