import jwt from "jsonwebtoken"

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}
