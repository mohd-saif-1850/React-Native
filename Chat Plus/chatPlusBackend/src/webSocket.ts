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

        socket.on("join-room", (roomId: string) => {
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

        socket.on("message-seen", async ({ messageId, roomId, userId }) => {
            await Message.findByIdAndUpdate(messageId, {
                seenAt: new Date(),
                $addToSet: { readBy: userId }
            });

            io.to(roomId).emit("message-seen", { messageId, userId });
        });

        socket.on("delete-for-me", async ({ messageId, roomId, userId }) => {
            await Message.findByIdAndUpdate(messageId, {
                $addToSet: { deletedFor: userId }
            });

            socket.emit("message-deleted-me", { messageId });
        });

        socket.on("delete-for-everyone", async ({ messageId, roomId }) => {
            await Message.findByIdAndUpdate(messageId, {
                message: "",
                deletedFor: []
            });

            io.to(roomId).emit("message-deleted-all", { messageId });
        });

        socket.on("user-online", async (userId: string) => {
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
