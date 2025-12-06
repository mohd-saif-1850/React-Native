import mongoose,{ Schema, Document, Types} from "mongoose";

export interface UserValidation extends Document{
    _id: Types.ObjectId,
    username?: string,
    email: string,
    otp?: number,
    otpExp?: Date,
    verified: boolean,
    image?: string,
    name?: string,
    gender?: string,
    about?: string,
    tutorial?: boolean
}

const userSchema : Schema<UserValidation> = new Schema({
    name: {
        type: String,
        default: "Unknown"
    },
    username: {
        type: String,
        index: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    otp: {
        type: Number
    },
    otpExp: {
        type: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ["Male","Female","Other","Not Specified"],
        default: "Not Specified"
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif",
    },
    about: {
        type: String,
        default: "Just Enjoying the Life !"
    },
    tutorial: {
        type: Boolean,
        default: true
    }
},{ timestamps: true })

userSchema.index({otpExp: 1}, { expireAfterSeconds: 0})

export const User = mongoose.model<UserValidation>("User",userSchema)