import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useSession } from "@/components/providers/SessionProvider";
import useGetMe from "@/hooks/useGetMe";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";



const Profile = () => {
  const { session, signOut } = useSession();
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;

  const { data, isLoading, error } = useGetMe(session);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background.primary }]}>
        <ActivityIndicator size="large" color={c.text.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.background.primary }]}>
        <Text style={{ color: "red" }}>Error fetching profile</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: c.text.primary }]}>
          {data?.name || "User"}
        </Text>
        <Text style={[styles.email, { color: c.text.secondary }]}>
          {data?.email}
        </Text>
      </View>

      <TouchableOpacity
        onPress={signOut}
        style={[styles.logoutBtn, { backgroundColor: "#FF4444" }]}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 24, // Reduced from 48
    alignItems: "center",
  },
  name: {
    fontSize: 32,
    fontFamily: "generalSemiBold",
    letterSpacing: -1,
  },
  email: {
    fontSize: 18,
    fontFamily: "generalReqular",
    marginTop: 8,
  },
  infoSection: {
    marginTop: 24, // Added top margin
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 14,
    fontFamily: "generalMedium",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: "generalReqular",
  },
  logoutBtn: {
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 24, // Space before the info section
  },
  logoutText: {
    color: "white",
    fontFamily: "generalSemiBold",
    fontSize: 18,
  },
});
