// src/lib/pragma.ts
let socket: WebSocket | null = null;
let listeners: ((data: { price: number }) => void)[] = [];

export function subscribeToPragmaPriceFeed(callback: (data: { price: number }) => void) {
  listeners.push(callback);

  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket("wss://ws.devnet.pragma.build/node/v1/data/subscribe");

    socket.addEventListener("open", () => {
      console.log("✅ Pragma WS connected");
      socket?.send(JSON.stringify({
        msg_type: "subscribe",
        pairs: ["BTC/USD"]
      }));
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data.oracle_prices) && data.oracle_prices.length > 0) {
          const median_price_str = data.oracle_prices[0].median_price;
          const parsed = Number(median_price_str) / 1e18; // Pragma prices have 18 decimals
          listeners.forEach(cb => cb({ price: parsed }));
        } else if (data?.median_price) {
          const parsed = Number(data.median_price) / 1e18;
          listeners.forEach(cb => cb({ price: parsed }));
        }
      } catch (err) {
        console.warn("❌ Failed to parse Pragma WS message", err);
      }
    });

    socket.addEventListener("error", (err) => {
      console.error("❌ WS error:", err);
    });

    socket.addEventListener("close", () => {
      console.warn("⚠️ Pragma WS closed");
      socket = null;
    });
  }
}

export function unsubscribeFromPragmaFeed(callback: (data: { price: number }) => void) {
  listeners = listeners.filter(cb => cb !== callback);
}
