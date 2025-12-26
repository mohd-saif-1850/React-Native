import mongoose, { Schema, Document, Types} from "mongoose";

export interface IChallenge extends Document{
    title: string;
    owner: Types.ObjectId;
    category: string;
    points: number;
    entryPoints: number;
    challenge: string;
    start?: Date;
    end: Date;
    totalPoints?: number;
    participants?: Types.ObjectId[];
    totalParticipants?: number;
    challengeStatus?: "upcoming" | "active" | "completed" | "expired" | "filled";
    difficulty?: "easy" | "medium" | "hard";
    completedBy?: Types.ObjectId[];
    isPrivate?: boolean;
    rewardPoints?: number;
    description?: string;
}

const challengeSchema : Schema<IChallenge> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    entryPoints: {
        type: Number,
        required: true
    },
    challenge: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    participants: [{
        type: Types.ObjectId,
        ref: "User",
        unique: true
    }],
    totalParticipants: {
        type: Number,
        default: 20
    },
    challengeStatus: {
        type: String,
        enum: ["upcoming","active","completed","expired","filled"],
        default: "active"
    },
    difficulty: {
        type: String,
        enum: ["easy","medium","hard"],
        default: "easy"
    },
    completedBy: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    rewardPoints: {
        type: Number,
        default: 50
    },
    description: {
        type: String
    },
    points: {
        type: Number,
        default: 200
    }
},{ timestamps: true })

export const Challenge = mongoose.model<IChallenge>("Challenge",challengeSchema)