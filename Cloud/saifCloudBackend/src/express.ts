import express from "express"

const app = express()

app.get("/",(req,res) => {
    res.send("Saif Cloud Server is running!")
})

export default app;