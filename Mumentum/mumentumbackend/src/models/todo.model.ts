import mongoose,{ Schema, Document, Types} from "mongoose";

export interface ITodo extends Document{
    userId: Types.ObjectId;
    task: string;
    expiry: Date;
}

const todoSchema : Schema<ITodo> = new Schema({
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
    expiry: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const Todo = mongoose.model<ITodo>("Todo",todoSchema)