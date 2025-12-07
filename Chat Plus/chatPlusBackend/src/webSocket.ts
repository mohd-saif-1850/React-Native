import { Server, Socket } from "socket.io";
import { Message } from "./models/message.model";
import { User } from "./models/user.model";

interface CustomSocket extends Socket {
    userId?: string;
}

export const registerSocketServer = (server: any) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket: CustomSocket) => {

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
        });

        socket.on("send-message", async (data) => {
            try {
                const { roomId, message, sender } = data;

                const savedMessage = await Message.create({
                    roomId,
                    sender,
                    message
                });

                io.to(roomId).emit("receive-message", savedMessage);
            } catch (error) {
                console.log("Error saving message:", error);
            }
        });

        socket.on("typing", ({ roomId, sender }) => {
            socket.to(roomId).emit("typing", { sender });
        });

        socket.on("stop-typing", ({ roomId, sender }) => {
            socket.to(roomId).emit("stop-typing", { sender });
        });

        socket.on("message-delivered", async ({ messageId, roomId }) => {
            await Message.findByIdAndUpdate(messageId, {
                deliveredAt: new Date()
            });

            io.to(roomId).emit("message-delivered", { messageId });
        });

        socket.on("message-seen", async ({ messageId, roomId }) => {
            await Message.findByIdAndUpdate(messageId, {
                seenAt: new Date()
            });

            io.to(roomId).emit("message-seen", { messageId });
        });

        socket.on("user-online", async (userId) => {
            socket.userId = userId;

            await User.findByIdAndUpdate(userId, { online: true });

            io.emit("user-status-changed", { userId, online: true });
        });

        socket.on("disconnect", async () => {
            if (socket.userId) {
                await User.findByIdAndUpdate(socket.userId, {
                    online: false,
                    lastSeen: new Date()
                });

                io.emit("user-status-changed", {
                    userId: socket.userId,
                    online: false,
                    lastSeen: new Date()
                });
            }
        });
    });

    return io;
};
