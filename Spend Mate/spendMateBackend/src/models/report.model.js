import mongoose, {Schema} from "mongoose";

const reportSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    }
})

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
