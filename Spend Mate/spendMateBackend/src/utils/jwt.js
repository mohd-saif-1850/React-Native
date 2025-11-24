import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            subscription: user.subscription
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}
