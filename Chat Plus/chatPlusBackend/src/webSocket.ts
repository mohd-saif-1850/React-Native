import { Server } from "socket.io";

export const registerSocketServer = (server: any) => {
    const io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Join a room
        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        // Send message
        socket.on("send-message", (data) => {
            const { roomId, message, sender } = data;

            // Send message to everyone in that room
            io.to(roomId).emit("receive-message", {
                message,
                sender,
                time: Date.now(),
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
