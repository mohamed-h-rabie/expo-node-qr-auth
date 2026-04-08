import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { CircleAlert, CircleCheck, Eye, EyeOff } from "lucide-react-native";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

const Input = ({
  label = "Label",
  placeholder = "Enter value",
  value,
  onChangeText,
  secureTextEntry = false,
  containerStyle,
  labelStyle,
  error,
  errors,
  isSuccess,
  setShowPassword,
  showPassword,
}: any) => {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  console.log(isSuccess);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: c.text.primary }, labelStyle]}>{label}</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          style={[
            styles.input,
            {
              color: c.text.primary,
              borderColor: error
                ? "#ED1010"
                : isSuccess
                ? "#0C9409"
                : c.border.default, // default
              fontFamily: "generalReqular",
              outlineColor: !value ? c.text.primary : "",
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={c.text.secondary}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          // activeOutlineColor={activeOutlineColor}
        />
        {label === "Password" &&
          (showPassword ? (
            <View style={[styles.rightIconWrap, { right: 40, zIndex: 99 }]}>
              <EyeOff
                size={24}
                color="#CCCCCC"
                strokeWidth={2}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
          ) : (
            <View style={[styles.rightIconWrap, { right: 40, zIndex: 99 }]}>
              <Eye
                size={27}
                color={c.icon.default}
                strokeWidth={2}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
          ))}

        {error ? (
          <View style={[styles.rightIconWrap, { right: 10 }]}>
            <CircleAlert size={24} color="#ED1010" strokeWidth={2} />
          </View>
        ) : isSuccess ? (
          <View style={[styles.rightIconWrap, { right: 10 }]}>
            <CircleCheck size={24} color="#0C9409" strokeWidth={2} />
          </View>
        ) : (
          ""
        )}
      </View>
      {errors && <Text style={{ color: "#ED1010" }}>{errors.message}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 4,
  },

  label: {
    color: "#1A1A1A",
    fontSize: 16,
    fontFamily: "generalMedium",
  },

  input: {
    color: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "generalRegular",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingRight: 80,
  },
  rightIconWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
