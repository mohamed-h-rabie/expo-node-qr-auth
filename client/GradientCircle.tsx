import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const GradientCircle = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500, // 1.5s = 1500ms
        easing: Easing.linear,
      }),
      -1, // infinite
      false // no reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.loaderContainer, animatedStyle]}>
      <Svg width="55" height="55" viewBox="0 0 55 55">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="27.5"
          cy="27.5"
          r="19.5"
          stroke="url(#grad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

export default GradientCircle;

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 50,
    position: "relative",
    bottom: 200,
  },
});
