import { StyleSheet, ActivityIndicator, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/themed-text";
import { useSession } from "@/components/providers/SessionProvider";
import { useQRCodeWS } from "@/hooks/useQRCodeWS";
import useTheme from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";
import QRCode from "react-native-qrcode-svg";

const QrContentWS = () => {
  const { session } = useSession();
  const { theme } = useTheme();
  const c = theme.dark ? Colors.dark : Colors.light;
  const { qr } = useQRCodeWS(session);
  if (!qr?.uuid) {
    return (
      <View style={styles.qrCenter}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 8 }}>Loading QR via WS…</ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.qrCenter}>
      <View style={styles.qrBox}>
        <QRCode value={qr.uuid} size={220} />
      </View>
    </View>
  );
};

export default QrContentWS;

const styles = StyleSheet.create({
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
});
