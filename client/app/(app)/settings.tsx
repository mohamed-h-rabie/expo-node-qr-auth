import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import { ThemePreference } from "@/types/Theme";
import { Colors } from "@/constants/theme";

const OPTIONS: { label: string; value: ThemePreference; icon: string }[] = [
  { label: "Light", value: "light", icon: "☀️" },
  { label: "Dark", value: "dark", icon: "🌙" },
  { label: "System", value: "system", icon: "⚙️" },
];

const SettingsScreen = () => {
  const { theme, preference, setPreference } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: c.background.primary }]}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={[styles.heading, { color: c.text.primary }]}>
          Appearance
        </Text>
        <Text style={[styles.sub, { color: c.text.secondary }]}>
          Choose how the app looks to you.
        </Text>

        {/* Options */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: c.background.surface,
              borderColor: c.border.default,
            },
          ]}
        >
          {OPTIONS.map((opt, idx) => {
            const isSelected = preference === opt.value;
            const isLast = idx === OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setPreference(opt.value)}
                style={[
                  styles.row,
                  !isLast && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: c.border.default,
                  },
                ]}
                activeOpacity={0.6}
              >
                {/* Icon + Label */}
                <View style={styles.rowLeft}>
                  <Text style={styles.icon}>{opt.icon}</Text>
                  <Text style={[styles.rowLabel, { color: c.text.primary }]}>
                    {opt.label}
                  </Text>
                </View>

                {/* Radio */}
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected
                        ? c.button.primaryBg
                        : c.border.default,
                    },
                  ]}
                >
                  {isSelected && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: c.button.primaryBg },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.hint, { color: c.text.secondary }]}>
          "System" follows your device's appearance settings.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 32,
    gap: 12,
  },
  heading: {
    fontSize: 32,
    letterSpacing: -1.6,
    fontFamily: "generalSemiBold",
  },
  sub: {
    fontSize: 16,
    fontFamily: "generalReqular",
    marginTop: 4,
  },
  card: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 18,
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: "generalMedium",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  hint: {
    fontSize: 13,
    fontFamily: "generalReqular",
    lineHeight: 18,
    marginTop: 4,
  },
});
