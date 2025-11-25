import mongoose,{Schema} from "mongoose";

const expenseSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"],
        default: "Other"
    },
    otherCategory: {
        type: String
    },
    date: {
        type: String,
        default: () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
    },
    time: {
        type: String,
        default: () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${ampm}`;
        }
    },
    discription: {
        type: String
    }
}, { timestamps: true })

export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

