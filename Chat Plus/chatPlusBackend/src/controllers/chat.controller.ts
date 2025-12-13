import { Request, Response } from "express";
import { Chat } from "../models/chat.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

const createChat = async (req: Request, res: Response) => {
    try {
        const { friendId } = req.body;
        const userId = req.userId;

        if (!userId || !friendId) {
            return res.status(400).json({ success: false, message: "User IDs are required" });
        }

        let chat = await Chat.findOne({ members: { $all: [userId, friendId] } });

        if (!chat) {
            chat = await Chat.create({ members: [userId, friendId] });
        }

        return res.status(200).json({ success: true, chatId: chat._id });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error creating chat", error: error.message });
    }
};

const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Room ID is required" });
        }

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

        return res.status(200).json({ success: true, messages });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error fetching messages", error: error.message });
    }
};

const getAllChats = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const chats = await Chat.find({ members: userId });

        const result = [];

        for (const chat of chats) {
            const friendId = chat.members.find((m: any) => m !== userId);

            const friend = await User.findById(friendId)
                .select("name username image online lastSeen")
                .lean();

            const lastMessage = await Message.findOne({ roomId: chat._id })
                .sort({ createdAt: -1 })
                .lean();

            result.push({
                chatId: chat._id,
                friend,
                lastMessage: lastMessage ? lastMessage.message : null,
                lastMessageTime: lastMessage ? lastMessage.createdAt : null
            });
        }

        return res.status(200).json({ success: true, chats: result });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Error fetching chats", error: error.message });
    }
};

const markAsRead = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.body;
        const userId = req.userId;

        await Message.findByIdAndUpdate(messageId, {
            $addToSet: { readBy: userId },
            seenAt: new Date()
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteForMe = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.body;
        const userId = req.userId;

        await Message.findByIdAndUpdate(messageId, {
            $addToSet: { deletedFor: userId }
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteForEveryone = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.body;

        await Message.findByIdAndUpdate(messageId, {
            message: "",
            deletedFor: []
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export {
    createChat,
    getMessages,
    getAllChats,
    markAsRead,
    deleteForEveryone,
    deleteForMe
};