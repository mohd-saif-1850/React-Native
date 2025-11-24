import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import apiError from "../utils/apiError.js"

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.spendmate_token

    if (!token) {
        throw new apiError(401, "Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
        throw new apiError(404, "User not found")
    }

    next()
}
