import { io, Socket } from "socket.io-client";
import { store } from "../store/store";
import { receiveMessage } from "../store/slice/chatSlice";
import { refreshGroupData } from "../store/slice/groupsSlice";

export interface SocketMessage {
  id: string;
  groupId: string;
  content: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  timestamp: string;
}

export interface GroupEvent {
  type: "member_joined" | "member_left";
  groupId: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    memberCount: number;
  };
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    console.log(
      "🔌 Attempting to connect to Socket.io with token:",
      token ? "Token present" : "No token"
    );

    this.socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
      {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
      }
    );

    this.setupEventHandlers();
    this.setupConnectionHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("new_message", (message: SocketMessage) => {
      console.log("📨 Received message via Socket.io:", message);

      const currentUser = store.getState().auth.user;
      const isCurrentUser =
        currentUser &&
        (message.sender.id === currentUser.id ||
          `${message.sender.firstName} ${message.sender.lastName}` ===
            `${currentUser.firstName} ${currentUser.lastName}`);

      store.dispatch(
        receiveMessage({
          groupId: message.groupId,
          content: message.content,
          sender: isCurrentUser
            ? "You"
            : `${message.sender.firstName} ${message.sender.lastName}`,
          id: message.id,
        })
      );
    });

    this.socket.on("member_joined", (event: GroupEvent) => {
      console.log(
        `👥 ${event.data.user.firstName} joined group ${event.groupId}`
      );

      store.dispatch(refreshGroupData(event.groupId));
    });

    this.socket.on("member_left", (event: GroupEvent) => {
      console.log(
        `👋 ${event.data.user.firstName} left group ${event.groupId}`
      );

      store.dispatch(refreshGroupData(event.groupId));
    });
  }

  private setupConnectionHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("🔌 Connected to Socket.io server");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Disconnected from Socket.io server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔌 Socket.io connection error:", error);
      this.isConnected = false;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.reconnect();
        }, 1000 * this.reconnectAttempts);
      }
    });
  }

  private reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinGroup(groupId: string) {
    if (this.socket?.connected) {
      this.socket.emit("join_group", groupId);
      console.log(`👥 Joined group room: ${groupId}`);
    }
  }

  leaveGroup(groupId: string) {
    if (this.socket?.connected) {
      this.socket.emit("leave_group", groupId);
      console.log(`👋 Left group room: ${groupId}`);
    }
  }

  sendMessage(groupId: string, content: string) {
    if (this.socket?.connected) {
      this.socket.emit("send_message", { groupId, content });
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }
}

export const socketService = new SocketService();
export default socketService;
