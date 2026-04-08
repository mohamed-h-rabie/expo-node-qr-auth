import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { BASE_IP } from "@/api/index";

export function useQRCodeWS(token: string | null | undefined) {
  const [qrData, setQrData] = useState<{
    uuid: string;
    generatedAt: number;
  } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intentionallyClosedRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    const hostname = Platform.OS === "android" ? BASE_IP : "localhost";
    const wsUrl = `ws://${hostname}:3000?token=${token}`;

    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    intentionallyClosedRef.current = false;

    const connect = () => {
      if (intentionallyClosedRef.current) return;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // connection established
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          console.log(event);

          setQrData(JSON.parse(event.data));
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        // error handled by onclose
      };

      ws.onclose = () => {
        if (intentionallyClosedRef.current) return;
        reconnectTimeout = setTimeout(() => connect(), 3000);
      };
    };

    connect();

    return () => {
      intentionallyClosedRef.current = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [token]);

  return { qr: qrData };
}
