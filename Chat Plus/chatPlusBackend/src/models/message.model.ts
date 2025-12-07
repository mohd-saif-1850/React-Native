import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    roomId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    deliveredAt?: Date;
    seenAt?: Date
}

const messageSchema = new Schema<IMessage>(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        deliveredAt: { 
            type: Date 
        },
        seenAt: { 
            type: Date 
        }
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
