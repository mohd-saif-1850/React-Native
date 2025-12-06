import express from "express"
import morgan from "morgan"
import cors from "cors"

const app = express();

//Cors Configuration Here !
app.use(cors({
    origin: [
        "*"
    ]
}))

//Middlewares Configuration Here !
app.use(express.json())
app.use(morgan("dev"))

app.get("/",(req,res) => {
    res.send("App is Running Bro just Use it !")
})

//Routes Here !
import userRoutes from "./routes/user.route"

app.use("/api/v1/user",userRoutes)

export default app;