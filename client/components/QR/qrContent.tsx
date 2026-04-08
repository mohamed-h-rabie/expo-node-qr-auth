import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { useState, useEffect } from "react";

import { ThemedText } from "@/components/themed-text";
import { useSession } from "@/components/providers/SessionProvider";
import { useCurrentQR } from "@/hooks/useCurrentQR";
import QRCode from "react-native-qrcode-svg";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

const QrContent = () => {
  const { session, signOut } = useSession();
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const { qr, isLoading, error, refetch } = useCurrentQR(session);

  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Synchronize countdown with server timestamp
    const calculateTimeLeft = () => {
      if (qr?.generatedAt) {
        const elapsed = Math.floor((Date.now() - qr.generatedAt) / 1000);
        const remaining = Math.max(0, 60 - (elapsed % 60));
        setTimeLeft(remaining);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [qr?.generatedAt, qr?.uuid]);

  if (error) {
    return (
      <View style={styles.qrCenter}>
        <Text
          style={{
            color: "#ED1010",
            fontFamily: "generalMedium",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={{ color: c.text.primary, fontFamily: "generalMedium" }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || !qr?.uuid) {
    return (
      <View style={styles.qrCenter}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 8 }}>Loading QR…</ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.qrCenter}>
      <View style={styles.qrBox}>
        <QRCode value={qr.uuid} size={220} />
      </View>
      <Text
        style={{
          color: c.text.primary,
          fontSize: 15,
          fontFamily: "generalMedium",
          marginTop: 10,
        }}
      >
        (HTTP) Auto-refreshes in {timeLeft}s
      </Text>
    </View>
  );
};

export default QrContent;
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qrCard: {
    gap: 12,
    paddingVertical: 12,
  },
  qrCenter: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
  },
  retryButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
