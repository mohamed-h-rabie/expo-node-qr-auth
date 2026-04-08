import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import useSignUp from "@/hooks/useSignUp";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+/;

const signUpSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().regex(passwordRegex, {
    message:
      "Password must contain uppercase, lowercase, number and special character",
  }),
});
type SignUpSchemaType = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signUp, isPending, error: signUpError } = useSignUp();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // 👈 IMPORTANT

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<SignUpSchemaType> = (
    data: SignUpSchemaType
  ) => {
    console.log(data);
    signUp(data);
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
      <View>
        <Text style={[styles.headerText, { color: c.text.primary }]}>Create an account</Text>
        <Text style={[styles.secandaryText, { color: c.text.secondary }]}>Let’s create your account.</Text>
      </View>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error, isDirty },
        }) => {
          const isSuccess = !error && isDirty 

          return (
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.name}
              errors={errors.name}
              isSuccess={isSuccess}
            />
          );
        }}
        name="name"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error, isDirty },
        }) => {
          const isSuccess = !error && isDirty 

          return (
            <Input
              label="Email"
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              errors={errors.email}
              isSuccess={isSuccess}
            />
          );
        }}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error, isDirty },
        }) => {
          const isSuccess = !error && isDirty 

          return (
            <Input
              label="Password"
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              value={value}
              error={!!errors.password}
              errors={errors.password}
              isSuccess={isSuccess}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
          );
        }}
        name="password"
      />

      {signUpError && (
        <Text
          style={{
            color: "#ED1010",
            textAlign: "center",
            fontFamily: "generalMedium",
          }}
        >
          {(signUpError as any)?.response?.data?.message || "Something went wrong"}
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
            Create an account
          </Text>
        )}
      </TouchableOpacity>

      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontFamily: "generalReqular",
          color: c.text.secondary,
        }}
      >
        Already have an account?{" "}
        <Link
          href="/sign-in"
          style={{
            color: c.text.primary,
            fontFamily: "generalMedium",
            textDecorationLine: "underline",
            textDecorationColor: c.text.primary,
            textDecorationStyle: "solid",
          }}
        >
          Log In
        </Link>
      </Text>
    </View>
  );
};

export default SignUp;

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
