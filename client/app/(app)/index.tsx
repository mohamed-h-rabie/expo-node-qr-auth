import { StyleSheet, Text, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/themed-view";
import QrContent from "@/components/QR/qrContent";
import QrContentWS from "@/components/QR/qrContentWS";
import { useSession } from "@/components/providers/SessionProvider";
import useGetMe from "@/hooks/useGetMe";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const { session } = useSession();
  const { data: user } = useGetMe(session);

  return (
    <ScrollView
      style={{
        backgroundColor: c.background.primary,
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 59,
      }}
      contentContainerStyle={{ gap: 16, paddingBottom: 200 }}
    >
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            color: c.text.secondary,
            fontSize: 18,
            fontFamily: "generalMedium",
          }}
        >
          Welcome back,
        </Text>
        <Text style={[styles.headerText, { color: c.text.primary }]}>
          {user?.name || "User"} 👋
        </Text>
      </View>

      <View>
        <Text
          style={{
            color: c.text.primary,
            fontSize: 22,
            fontFamily: "generalSemiBold",
            letterSpacing: -0.5,
          }}
        >
          Your current QR
        </Text>
        <Text style={styles.secondaryText}>
          Manage and monitor your QR code here.
        </Text>
      </View>

      <Text
        style={{
          color: c.text.primary,
          fontSize: 18,
          fontFamily: "generalMedium",
          marginTop: 10,
        }}
      >
        HTTP Update
      </Text>
      <ThemedView style={styles.qrCard}>
        <QrContent />
      </ThemedView>

      <Text
        style={{
          color: c.text.primary,
          fontSize: 18,
          fontFamily: "generalMedium",
          marginTop: 10,
        }}
      >
        WebSocket Update
      </Text>
      <ThemedView style={styles.qrCard}>
        <QrContentWS />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 32,
    letterSpacing: -1.6,
    fontFamily: "generalSemiBold",
  },
  secondaryText: {
    color: "#808080",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "generalReqular",
  },
  qrCard: {
    gap: 12,
    paddingVertical: 12,
  },
  signOutButton: {
    paddingHorizontal: 84,
    paddingVertical: 16,
    marginTop: 16,
    borderRadius: 10,
  },
});
