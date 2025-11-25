import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { deleteUnverifiedUsers } from "./utils/cleanUp.js";
import apiError from './utils/apiError.js';
import apiResponse from './utils/apiResponse.js';


const app = express()

app.use(cors({
    origin: [
        "http://localhost:8081",
        "exp://10.44.173.149:8081"
    ]
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
import feedbackRouter from "./routes/feedback.route.js";
import reportRouter from "./routes/report.route.js";
import refineTitleRouter from "./routes/refineTitle.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/report", reportRouter);

app.use("/api/v1", refineTitleRouter);

app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  console.error("SERVER ERROR:", err);

  return res.status(500).json({
    message: "Internal Server Error"
  });
});

//Automatic delete the unverified user after 10 minutes 
setInterval(deleteUnverifiedUsers, 10 * 60 * 1000);

export default app;