import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
  seenAt?: Date;
  readBy?: mongoose.Types.ObjectId;
  deletedFor?: mongoose.Types.ObjectId
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
      type: Date,
    },
    seenAt: {
      type: Date,
    },
    readBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    deletedFor: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
