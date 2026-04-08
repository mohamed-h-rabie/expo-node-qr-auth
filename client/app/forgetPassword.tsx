import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Input from "@/components/ui/Input";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import useForgetPassword from "@/hooks/useForgetPassword";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";
const ForgetPassword = () => {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const router = useRouter();
  const {
    mutate: sendForgetPasswordEmail,
    isPending,
    error: forgetError,
  } = useForgetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: { email: string }) => {
    sendForgetPasswordEmail(data);
  };
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
        <Text style={[styles.headerText, { color: c.text.primary }]}>
          Forgot password
        </Text>
        <Text style={[styles.secandaryText, { color: c.text.secondary }]}>
          Enter your email for the verification process. We will send 6 digits
          code to your email.
        </Text>
      </View>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({
          field: { onChange, value },
        }) => {
          return (
            <Input
              label="Email"
              placeholder="Enter your email"
              onChangeText={onChange}
              value={value}
            />
          );
        }}
        name="email"
      />

      {forgetError && (
        <Text
          style={{
            color: "#ED1010",
            textAlign: "center",
            fontFamily: "generalMedium",
          }}
        >
          {(forgetError as any)?.response?.data?.message ||
            "Something went wrong"}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[
          styles.createButton,
          { borderColor: c.border.default },
          errors && !isValid
            ? { backgroundColor: c.interactive.disabled }
            : { backgroundColor: c.button.primaryBg },
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
            Send Code
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPassword;

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
