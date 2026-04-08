import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { OtpInput } from "react-native-otp-entry";
import useVerificate from "@/hooks/useVerificate";
import useResendOTP from "@/hooks/userResendOTP";
import useVerificateResetPassword from "@/hooks/useVerificateResetPassword";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

const Verification = () => {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const { type } = useLocalSearchParams();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { mutate: verificate, isPending, error: verifyError } = useVerificate();
  const { mutate: verificateResetPassword, isPending: isPendingResetPassword, error: resetVerifyError } =
    useVerificateResetPassword();
  const { mutate: resendCode, error: resendError } = useResendOTP();
  console.log(email);

  console.log(type);

  useEffect(() => {
    const getEmail = async () => {
      try {
        let storedEmail;
        if (Platform.OS === "web") {
          storedEmail = localStorage.getItem("email");
          setEmail(storedEmail ?? "");
        }

        storedEmail = await SecureStore.getItemAsync("email");
        console.log(storedEmail, "momo");

        setEmail(storedEmail ?? "");
        if (!storedEmail) {
          router.replace("/sign-in");
        }
      } catch (error) {
        console.log("Error fetching email from SecureStore:", error);
      }
    };

    getEmail();
    return () => {
      // Cleanup function runs on unmount
    };
  }, [router]);
  return (
    <View
      style={{
        backgroundColor: c.background.primary,
        flex: 1,
        paddingHorizontal: 24,
        gap: 16,
        paddingTop: 59,
      }}
    >
      <ArrowLeft
        onPress={() => router.back()}
        size={24}
        color={c.text.primary}
        strokeWidth={3}
      />
      <View>
        <Text style={[styles.headerText, { color: c.text.primary }]}>Enter 6 Digit Code</Text>
        <Text style={[styles.secandaryText, { color: c.text.secondary }]}>
          Enter 6 digit code that your receive on your email ({email}).
        </Text>
      </View>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(text) => {
          console.log("Current OTP value:", text);
          setOtp(text); // always set the current value
        }}
        theme={{
          pinCodeTextStyle: { ...styles.pinCodeText, color: c.text.primary },
          pinCodeContainerStyle: { borderColor: c.border.default },
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          focusStickStyle: styles.focusStick,
        }}
      />

      {(verifyError || resetVerifyError || resendError) && (
        <Text
          style={{
            color: "#ED1010",
            textAlign: "center",
            fontFamily: "generalMedium",
          }}
        >
          {((verifyError || resetVerifyError || resendError) as any)?.response?.data?.message || "Something went wrong"}
        </Text>
      )}

      <TouchableOpacity
        onPress={() =>
          type === "resetPassword"
            ? verificateResetPassword({ otp, email })
            : verificate({ otp, email })
        }
        style={[
          styles.verifyButton,
          { borderColor: c.border.default },
          otp.length < 6 ? { backgroundColor: c.interactive.disabled } : { backgroundColor: c.button.primaryBg },
        ]}
        disabled={!otp}
      >
        {isPending || isPendingResetPassword ? (
          <ActivityIndicator
            style={{ alignSelf: "center" }}
            size="small"
            color={c.button.primaryText}
          />
        ) : (
          <Text
            style={{
              color: c.button.primaryText,
              textAlign: "center",
              fontSize: 16,
              fontFamily: "generalMedium",
            }}
          >
            {type === "resetPassword" ? "Continue" : "verify"}
          </Text>
        )}
        {/* )} */}
      </TouchableOpacity>
      <Text
        style={{
          color: c.text.secondary,
          fontSize: 16,
          fontFamily: "generalReqular",
          textAlign: "center",
        }}
      >
        Email not received?
        <Text
          onPress={() => {
            resendCode({ email });
          }}
          style={{
            color: c.text.primary,
            textDecorationLine: "underline",
            textDecorationColor: c.text.primary,
            fontFamily: "generalMedium",
          }}
        >
          Resend code
        </Text>
      </Text>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  headerText: {
    color: "#1A1A1A",
    fontSize: 32,
    letterSpacing: -1.6,
    fontFamily: "generalSemiBold",
  },
  secandaryText: {
    color: "#808080",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "generalReqular",
  },
  pinCodeText: {
    fontFamily: "generalSemiBold",
  },

  activePinCodeContainer: {
    borderColor: "#0C9409", // <-- when input is focused
  },
  focusStick: {
    height: 25,
    backgroundColor: "#0C9409", // <-- color of focus stick
  },
  verifyButton: {
    // backgroundColor: "#CCCCCC",
    paddingHorizontal: 84,
    paddingVertical: 16,
    marginTop: 16,
    // fontSize: 16,
    // fontFamily: "generalReqular",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: "#CCCCCC",
  },
  enabled: {
    backgroundColor: "#1A1A1A",
  },
});
