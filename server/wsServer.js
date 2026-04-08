import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { getCurrentQR } from "./services/qrService.js";

export function setupWSS(server) {
  // 1. Rename 'ws' to 'wss' to avoid collision with individual 'ws' client
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("New WS Client connected"); // Add logging
    try {
      const url = new URL(req.url, "http://192.168.1.8");
      const token = url.searchParams.get("token");
      if (!token) throw new Error("No token");
      let decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log(decoded);
    } catch (err) {
      console.log("WS Auth failed:", err.message);
      ws.close(1008, "Unauthorized");
      return;
    }

    // Send the current QR immediately on connect
    ws.send(JSON.stringify(getCurrentQR()));

    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
  });

  // Heartbeat
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      // Use 'wss'
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 60_000);

  wss.on("close", () => clearInterval(heartbeat));

  // Broadcast loop
  let lastSentUuid = null;
  setInterval(() => {
    const currentQR = getCurrentQR();
    if (currentQR.uuid !== lastSentUuid) {
      lastSentUuid = currentQR.uuid;
      const payload = JSON.stringify(currentQR);
      console.log("Broadcasting new QR via WS:", currentQR.uuid);

      // 2. Use 'wss.clients' to reach ALL connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    }
  }, 1000);
}
