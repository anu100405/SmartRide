import type { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: typeof Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export default getSocket;
