import mongoose, {Schema } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        default: 'None'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    gender: {
        type: String,
        default: "Not Specified"
    },
    dob: {
        type: String
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    profileUrl: {
        type: String,
        default: 'https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif'
    },
    tutorial: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    totalSpend: {
        type: Number,
        default : 0
    },
    monthSpend: {
        type: Number,
        default: 0
    },
    subscription: {
        type: Boolean,
        default: false
    }


},{ timestamps: true })

export const User = mongoose.models.User || mongoose.model("User", userSchema);