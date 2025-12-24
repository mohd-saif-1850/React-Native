import mongoose,{ Schema, Document, Types} from "mongoose";

export interface ITask extends Document{
    userId: Types.ObjectId;
    task: string;
    isActive: Boolean;
    completion: boolean;
    daysTake?: number;
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
    daysTake: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

export const Task = mongoose.model<ITask>("Task",taskSchema)