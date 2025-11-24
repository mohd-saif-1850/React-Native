import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { deleteUnverifiedUsers } from "./utils/cleanUp.js";



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Welcome to the SpendMate Backend !");
});

// Now this part is for the Routes 
import userRouter from "./routes/user.route.js";
import expenseRouter from "./routes/expense.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/expense", expenseRouter);


//Automatic delete the unverified user after 10 minutes 
setInterval(deleteUnverifiedUsers, 10 * 60 * 1000);

export default app;