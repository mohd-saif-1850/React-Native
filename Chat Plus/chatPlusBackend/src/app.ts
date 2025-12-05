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

export default app;