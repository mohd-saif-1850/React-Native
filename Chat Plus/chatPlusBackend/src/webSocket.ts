import { Server } from "socket.io";
import { Message } from "./models/message.model";

export const registerSocketServer = (server: any) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
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

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
