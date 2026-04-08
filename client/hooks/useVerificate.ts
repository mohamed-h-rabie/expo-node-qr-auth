import { useSession } from "@/components/providers/SessionProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import apiClient from "@/api/index";

const verificate = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(`/users/verifyUser`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.response?.data);
    throw error; // MUST throw so React Query catches it
  }
};

const useVerificate = () => {
  const router = useRouter();
  const { signIn } = useSession(); // Get signIn from context

  const mutation = useMutation({
    mutationFn: verificate,
    // onMutate: () => setLoading(true),
    onSuccess: async (data) => {
      console.log("user Verified");
      console.log(data);

      const token = data.token;
      const expiresInMs = Number(data.expiresInMs);
      const expiryTime =
        Number.isFinite(expiresInMs) && expiresInMs > 0
          ? Date.now() + expiresInMs
          : null;
      console.log(token);

      // if (Platform.OS === "web") {
      //   localStorage.setItem("token", token);
      // }
      const canBio = await SecureStore.canUseBiometricAuthentication();
      if (canBio) {
        Alert.alert(
          "Enable Biometric Login?",
          "You can unlock the app next time with your fingerprint/FaceID.",
          [
            {
              text: "Yes",
              onPress: async () => {
                await SecureStore.setItemAsync("biometricEnabled", "true");
              },
            },
            {
              text: "No",
              onPress: async () => {
                await SecureStore.setItemAsync("biometricEnabled", "false");
              },
            },
          ]
        );
      }

      signIn(token, expiryTime);
      router.replace("/");

      // router.push("/");
    },
    onError: (error: any) => {
      router.push("/");

      console.log("❌ Server Error:", error.response?.data);
    },
  });
  return mutation;
};
export default useVerificate;
