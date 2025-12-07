import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
    members: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
