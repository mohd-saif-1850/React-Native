import jwt from 'jsonwebtoken'

export const generateToken = (userId: string, email: string) => {
    return jwt.sign({
        id: userId,
        email
    },
    process.env.JWT_SECRET as string,
    {expiresIn: "30d"}
    )
    
}