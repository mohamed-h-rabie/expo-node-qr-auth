import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import * as Network from "expo-network";
import { WifiOff } from "lucide-react-native";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

const NetworkBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected || !state.isInternetReachable);
    };

    // Poll for network status changes since expo-network doesn't have a listener
    const interval = setInterval(checkNetwork, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: "#ED1010",
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <WifiOff size={20} color="white" />
        <Text style={styles.text}>No internet connection. Using offline mode.</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontFamily: "generalMedium",
  },
});

export default NetworkBanner;
