import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";

const createChat = async (req: Request, res: Response) => {
    try {
        const { friendId } = req.body;
        const userId = req.userId

        if (!userId || !friendId) {
            return res.status(400).json({
                success: false,
                message: "User IDs are required"
            });
        }

        let chat = await Chat.findOne({
            members: { $all: [userId, friendId] }
        });

        if (!chat) {
            chat = await Chat.create({
                members: [userId, friendId]
            });
        }

        return res.status(200).json({
            success: true,
            chatId: chat._id
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error creating chat",
            error: error.message
        });
    }
};

const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required",
            });
        }

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching messages",
            error: error.message,
        });
    }
};

const getAllChats = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const chats = await Chat.find({ members: userId }).populate("members");

        const chatList = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await Message.findOne({ roomId: chat._id })
                    .sort({ createdAt: -1 });

                return {
                    chatId: chat._id,
                    members: chat.members,
                    lastMessage: lastMessage?.message || "",
                    lastMessageTime: lastMessage?.createdAt || null
                };
            })
        );

        return res.status(200).json({
            success: true,
            chats: chatList
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error fetching chats",
            error: error.message,
        });
    }
};

export {
    createChat,
    getMessages,
    getAllChats
}