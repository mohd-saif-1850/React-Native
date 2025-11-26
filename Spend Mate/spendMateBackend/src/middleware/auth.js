import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import apiError from "../utils/apiError.js"

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new apiError(401, "No authorization header provided")
  }

  const [type, token] = authHeader.split(" ")

  if (type.toLowerCase() !== "bearer" || !token) {
    throw new apiError(401, "Invalid authorization format")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      throw new apiError(404, "User not found")
    }

    next()
  } catch (err) {
    throw new apiError(401, "Invalid or expired token")
  }
}
