import dotenv from "dotenv"
dotenv.config()

import app from "./app";
import dbConnect from "./utils/dbConnect";

const port = process.env.PORT || 5000;

dbConnect()
app.listen(port, () => {
    console.log("Backend is Running at Port : ",port)
})