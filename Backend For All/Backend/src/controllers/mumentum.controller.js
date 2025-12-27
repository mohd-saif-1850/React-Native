import { sendVerificationEmail } from "../helpers/mumentumVerification.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import { sendForgotPassword } from "../helpers/mumentumForgotPassword.js"

const verification = async (req,res) => {
    const { username, email} = req.body

    if (!email) {
        throw new apiError(404,"Email is required !")
    }
    if (!username) {
        throw new apiError(404,"Username is required !")
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const result = await sendVerificationEmail(username,email,otp)

    return res.status(200).json(
        new apiResponse(200,`Otp send successfully on Email ${email} !`,otp)
    )
}

const forgotPassword = async (req,res) => {
    const { username, email } = req.body

    if (!username) {
        throw new apiError(404,"Username is required !")
    }
    if (!email) {
        throw new apiError(404,"Email is required !")
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const result = await sendForgotPassword(username,email,otp)

    return res.status(200).json(
        new apiResponse(200,"Forgot Password verification email sent !",otp)
    )
}

export {
    verification,
    forgotPassword
}