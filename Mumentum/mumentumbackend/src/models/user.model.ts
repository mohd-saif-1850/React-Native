import mongoose,{ Schema, Document} from "mongoose";

export interface IUser extends Document{
    name?: string;
    username: string;
    email?: string;
    password?: string;
    verified?: boolean;
    otp?: number;
    otpExp?: Date;
    gender?: string;
    dob?: Date;
    profilePic: string;
    subscription: boolean;
    githubId?: string;
    profilePicId?: string;
    streak?: number;
    points?: number;
    challenge: boolean;
    challengePoints?: number;
    challengeStreak?: number;
}

const userSchema : Schema<IUser> = new Schema({
    name: {
        type: String,
        default: "Unknown",
        trim: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif",
    },
    subscription: {
        type: Boolean,
        default: false
    },
    githubId: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
        default: "Not Specified"
    },
    dob: {
        type: Date
    },
    profilePicId: {
        type: String
    },
    streak: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
    challengePoints: {
        type: Number,
        default: 2000
    },
    challengeStreak: {
        type: Number,
        default: 0
    },
    challenge: {
        type: Boolean,
        default: false
    },
    password: {
        type: String
    }
},{ timestamps: true })

export const User = mongoose.model<IUser>("User",userSchema)