import {
  Alert,
  LayoutChangeEvent,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
// import { TabBarButton } from "./TabBarButton"; // import the button above
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { TabBarButton } from "./TabBarButton";
import React, { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  const buttonWidth = dimensions.width / state.routes.length;
  const onTabLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    const width = e.nativeEvent.layout.width;
    setDimensions({ width, height });
  };
  const tabPositionX = useSharedValue(0);

  const animtedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });
  console.table(state.routes);
  return (
    <View onLayout={onTabLayout} style={style.tabBar}>
      <Animated.View
        style={[
          animtedStyle,
          {
            backgroundColor: "rgba(0, 0, 0, 1)",
            position: "absolute",
            width: buttonWidth - 25,
            height: dimensions.height - 15,
            borderRadius: 30,
            marginHorizontal: 12,
          },
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          Alert.alert("Long Press", `You long-pressed ${route.name}`);

          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
          Vibration.vibrate(100);
        };
        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routerName={route.name}
            label={label}
          />
        );
      })}
    </View>
  );
}

const style = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    marginHorizontal: 60,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 35,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});
