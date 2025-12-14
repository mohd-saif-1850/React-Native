import mongoose,{Schema} from "mongoose"

const userSchema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dlzi244at/image/upload/v1763367677/defaultPersonImage_exseqc.avif"
    },
    bio: {
        type: String
    }
},{ timestamps: true})

export const User = mongoose.model("User",userSchema)