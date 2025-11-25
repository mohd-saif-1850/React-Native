import mongoose, {Schema} from "mongoose";

const feedbackSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
