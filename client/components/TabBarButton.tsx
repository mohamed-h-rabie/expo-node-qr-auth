import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import React, { useEffect } from "react";
import {
  CircleUser,
  Home,
  Settings,
} from "lucide-react-native";
const icons = {
  profile: (props: any) => <CircleUser name="profile" size={24} {...props} />,
  settings: (props: any) => <Settings name="profile" size={24} {...props} />,

  index: (props: any) => <Home name="index" size={24} {...props} />,
};
type BottomTabBarButtonProps = {
  routerName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
};
export function TabBarButton({
  routerName,
  isFocused,
  onPress,
  label,
}: BottomTabBarButtonProps) {
  const scale = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 12]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);
  return (
    <Pressable
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={animatedIconStyle}>
        {icons[routerName as keyof typeof icons]({
          color: isFocused ? "#fff" : "#1a1a1a",
        })}
      </Animated.View>

      <Animated.Text style={animatedTextStyle}>{label}</Animated.Text>
    </Pressable>
  );
}
