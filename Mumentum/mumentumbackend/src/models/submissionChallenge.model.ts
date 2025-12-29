import mongoose, { Schema, Document, Types} from "mongoose";

export interface ISubmission extends Document{
    userId: Types.ObjectId;
    challengeId: Types.ObjectId;
    answer: string;
    status: "submitted" | "reviewed" | "accepted" | "rejected";
    score?: number;
    feedback?: string;
}

const submissionSchema: Schema<ISubmission> = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    challengeId: {
        type: Types.ObjectId,
        ref: "Challenge",
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["submitted", "reviewed", "accepted", "rejected"],
        default: "submitted"
    },
    score: {
        type: Number
    },
    feedback: {
        type: String
    }
},{ timestamps: true })

export const Submission = mongoose.model<ISubmission>("Submission",submissionSchema)