import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import { dbConnect } from "./database/dbConnect"


dbConnect();
app.listen(process.env.PORT, () => {
    console.log("Your App is Running on the Port : ",process.env.PORT)
})