import { useSession } from "@/components/providers/SessionProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

import apiClient from "@/api/index";

const signIn = async (data: { email: string; password: string }) => {
  try {
    const res = await apiClient.post(`/users/signIn`, data);
    console.log("SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("AXIOS ERROR:", error.response?.data?.message);
    throw error; // MUST throw so React Query catches it
  }
};

const useSignIn = () => {
  const router = useRouter();
  const { signIn: saveToken } = useSession();

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      console.log("user Signed");
      const token = data.token;
      const expiresInMs = Number(data.expiresInMs);
      const expiryTime =
        Number.isFinite(expiresInMs) && expiresInMs > 0
          ? Date.now() + expiresInMs
          : null;
      // if (Platform.OS === "web") {
      //   localStorage.setItem("email", email);
      // }
      console.log(token, "dataaaaaaaa");

      const canBio = await SecureStore.canUseBiometricAuthentication();
      console.log(canBio);

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

      saveToken(token, expiryTime);
    },
  });
  return mutation;
};
export default useSignIn;
