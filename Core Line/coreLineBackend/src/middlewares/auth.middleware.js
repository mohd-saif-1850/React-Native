import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized !" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.userId)
    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid or expired - Please Login Again !",
    })
  }
}
