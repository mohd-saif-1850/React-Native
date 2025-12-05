import mongoose from "mongoose";

export const dbConnect = async () => {
    const uri = process.env.MONGODB_URI as string
    try {
        await mongoose.connect(uri)
        console.log("Database Connected Successfully !")
    } catch (error) {
        console.log("Database Connection Failed : ", error)
        process.exit(1)
    }
}