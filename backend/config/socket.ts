import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import type { User } from "../models/User";
import { User as UserModel, Message as MessageModel } from "../models";

export interface AuthenticatedSocket extends Socket {
  user?: User;
}

export interface SocketUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  content: string;
  sender: SocketUser;
  timestamp: string;
}

export interface GroupEvent {
  type: "member_joined" | "member_left" | "message_sent";
  groupId: string;
  data: any;
}

class SocketManager {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, string> = new Map();
  private groupRooms: Map<string, Set<string>> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    if (!this.io) return;

    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token =
          socket.handshake.auth.token || socket.handshake.headers.authorization;

        if (!token) {
          return next(new Error("Authentication error"));
        }

        const cleanToken = token.replace("Bearer ", "");
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET!) as any;

        if (!decoded.userId) {
          return next(new Error("Invalid token structure"));
        }

        const user = await UserModel.findByPk(decoded.userId);
        if (!user) {
          return next(new Error("User not found"));
        }

        socket.user = user;

        next();
      } catch (error) {
        console.error("❌ Socket authentication error:", error);
        next(new Error("Authentication error"));
      }
    });
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on("connection", (socket: AuthenticatedSocket) => {
      if (socket.user) {
        const userData = socket.user.toJSON();
        this.userSockets.set(userData.id, socket.id);
      }

      socket.on("join_group", (groupId: string) => {
        socket.join(`group_${groupId}`);

        if (!this.groupRooms.has(groupId)) {
          this.groupRooms.set(groupId, new Set());
        }
        this.groupRooms.get(groupId)!.add(socket.id);
      });

      socket.on("leave_group", (groupId: string) => {
        socket.leave(`group_${groupId}`);

        const room = this.groupRooms.get(groupId);
        if (room) {
          room.delete(socket.id);
          if (room.size === 0) {
            this.groupRooms.delete(groupId);
          }
        }
      });

      socket.on(
        "send_message",
        async (data: { groupId: string; content: string }) => {
          if (!socket.user) return;

          try {
            const userData = socket.user.toJSON();

            const savedMessage = await MessageModel.create({
              groupId: data.groupId,
              userId: userData.id,
              content: data.content,
              messageType: "text",
            });

            const message: GroupMessage = {
              id: savedMessage.toJSON().id,
              groupId: data.groupId,
              content: data.content,
              sender: {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                avatar: userData.avatar || undefined,
              },
              timestamp:
                savedMessage.toJSON().createdAt?.toISOString() ||
                new Date().toISOString(),
            };

            this.io!.to(`group_${data.groupId}`).emit("new_message", message);
          } catch (error) {}
        }
      );

      socket.on("disconnect", () => {
        if (socket.user) {
          const userData = socket.user.toJSON();
          this.userSockets.delete(userData.id);

          this.groupRooms.forEach((room, groupId) => {
            if (room.has(socket.id)) {
              room.delete(socket.id);
              if (room.size === 0) {
                this.groupRooms.delete(groupId);
              }
            }
          });
        }
      });
    });
  }

  public emitToGroup(groupId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`group_${groupId}`).emit(event, data);
    }
  }

  public emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public getConnectedUsers(): number {
    return this.io?.sockets.sockets.size || 0;
  }

  public getGroupMembers(groupId: string): number {
    return this.groupRooms.get(groupId)?.size || 0;
  }
}

export const socketManager = new SocketManager();
export default socketManager;
