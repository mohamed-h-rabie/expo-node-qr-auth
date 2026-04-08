import { Alert, View } from "react-native";
import Logo from "../assets/images/Vector.svg";
import Wave from "../assets/images/wave.svg";

import GradientCircle from "@/GradientCircle";
import { useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

export function SplashScreenController({
  setUnlocked,
}: {
  setUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const auth = useCallback(async () => {
    const bioEnabled = await SecureStore.getItemAsync("biometricEnabled");
    const token = await SecureStore.getItemAsync("token");

    console.log(token, typeof bioEnabled);

    if (bioEnabled === "true" && token) {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock App",
      });

      if (res.success) {
        setUnlocked(true); // allow access
      }
      if (!res.success) {
        return Alert.alert(
          "Authentication Required",
          "You must unlock the app to continue.",
          [
            {
              text: "Try Again",
              onPress: () => auth(), // 👈 run again!
            },
          ],
        );
      }
    } else {
      // first-time login or user didn't enable biometric
      setUnlocked(true);
    }
  }, [setUnlocked]);

  useEffect(() => {
    auth();
  }, [auth]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        position: "relative",
        // paddingVertical: 0,
        // gap: 100,
      }}
    >
      <View
        style={{
          position: "relative",
          width: "100%",
          // bottom: 300,
        }}
      >
        <Wave
          width="100%"
          color="#333333"
          style={{
            position: "absolute",
            top: 50,
            left: 0,
          }}
        />
        <Wave
          width="100%"
          color="#333333"
          style={{
            position: "absolute",
            top: 100,
            left: 0,
          }}
        />
        <Wave
          width="100%"
          color="#333333"
          style={{
            position: "absolute",
            top: 150,
            left: 0,
          }}
        />
        <Wave
          width="100%"
          color="#333333"
          style={{
            position: "absolute",
            top: 200,
            left: 0,
          }}
        />
      </View>

      <Logo width={135} height={135} />

      <GradientCircle />
    </View>
  );
}
