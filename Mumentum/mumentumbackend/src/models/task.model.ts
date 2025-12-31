import mongoose,{ Schema, Document, Types} from "mongoose";

export interface ITask extends Document{
    userId: Types.ObjectId;
    task: string;
    isActive: Boolean;
    completion: boolean;
    expiresAt: Date;
}

const taskSchema : Schema<ITask> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    task: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    completion: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

export const Task = mongoose.model<ITask>("Task",taskSchema)