import mongoose,{ Document, Schema, Types} from "mongoose";

export interface IFeedbackChallenge extends Document{
    userId: Types.ObjectId;
    challengeId: Types.ObjectId;
    feedback: string;
    response?: string;
    status: "submitted" | "reviewed" | "resolved";
    bonusPoints: number;
}

const feedbackSchema: Schema<IFeedbackChallenge> = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    challengeId: {
        type: Types.ObjectId,
        ref: "Challenge",
        required: true
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    response: {
        type: String
    },
    status: {
        type: String,
        enum: ["submitted", "reviewed", "resolved"],
        default: "submitted"
    },
    bonusPoints: {
        type: Number,
        default: 10
    }
},{ timestamps: true })

export const ChallengeFeedback = mongoose.model<IFeedbackChallenge>("ChallengeFeedback",feedbackSchema)