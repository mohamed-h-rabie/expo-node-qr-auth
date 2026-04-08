import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import { useForm, Controller } from "react-hook-form";

import useResetPassword from "@/hooks/useResetPassword";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Logo from "../assets/images/Check-duotone.svg";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

const ResetPassword = () => {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const { mutate: resetPassword, isPending, error: resetError } = useResetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // 👈 IMPORTANT
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = (data: { password: string }) => {
    const mergedData = { ...data, email };
    resetPassword(mergedData);
  };
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
        // if (!storedEmail) {
        //   router.replace("/sign-in");
        // }
      } catch (error) {
        console.log("Error fetching email from SecureStore:", error);
      }
    };

    getEmail();
    return () => {
      // Cleanup function runs on unmount
      const clearEmail = async () => {
        try {
          await SecureStore.setItemAsync("email", "");
          setEmail("");
        } catch (error) {
          console.log("Error clearing email:", error);
        }
      };
      clearEmail();
    };
  }, []);
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
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible} // ✅ use your state
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: c.background.primary,
                padding: 24,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                alignSelf: "center",
                // marginHorizontal: "auto",
                width: 340,
                borderWidth: 1,
                borderColor: c.border.default,
              }}
            >
              <Logo width={78} height={78} />

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "generalSemiBold",
                  textAlign: "center",
                  color: c.text.primary,
                }}
              >
                Password Changed!
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "generalReqular",
                  textAlign: "center",
                  color: c.text.secondary,
                  // maxWidth: 300,
                }}
              >
                Your can now use your new password to login to your account.
              </Text>
              <TouchableOpacity
                // onPress={handleSubmit(onSubmit)}
                onPress={() => {
                  setModalVisible(false);
                  router.replace("/sign-in");
                }}
                style={[styles.createButton, { backgroundColor: c.button.primaryBg, borderColor: c.border.default }]}
              >
                <Text
                  style={{
                    color: c.button.primaryText,
                    textAlign: "center",
                    fontSize: 16,
                    fontFamily: "generalMedium",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
              {/* <Pressable onPress={() => setModalVisible(!modalVisible)}> */}
              {/* <Text>Hide Modal</Text> */}
              {/* </Pressable> */}
            </View>
          </View>
        </Modal>
        {/* <Pressable onPress={() => setModalVisible(true)}>
          <Text>Show Modal</Text>
        </Pressable> */}
      </View>
      {/* <ArrowLeft
        onPress={() => router.back()}
        size={24}
        color="#1A1A1A"
        strokeWidth={3}
      /> */}
      <View>
        <Text style={[styles.headerText, { color: c.text.primary }]}>Reset Password </Text>
        <Text style={[styles.secandaryText, { color: c.text.secondary }]}>
          Set the new password for your account so you can login and access all
          the features.
        </Text>
      </View>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <Input
              label="Password"
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              value={value}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
          );
        }}
        name="password"
      />

      {resetError && (
        <Text
          style={{
            color: "#ED1010",
            textAlign: "center",
            fontFamily: "generalMedium",
          }}
        >
          {(resetError as any)?.response?.data?.message || "Something went wrong"}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[
          styles.createButton,
          { borderColor: c.border.default },
          errors && !isValid ? { backgroundColor: c.interactive.disabled } : { backgroundColor: c.button.primaryBg },
        ]}
        disabled={errors && !isValid}
      >
        {isPending ? (
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
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

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
  createButton: {
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
