import { User } from "../models/user.model";
import { Request, Response } from "express";
import { sendVerifyEmail } from "../helpers/sendVerificationEmail";
import { ApiError } from "../helpers/apiError";
import { ApiResponse } from "../helpers/apiResponse";

const loginUser = async (req : Request,res : Response) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400,"Email is Required !")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExp = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.findOne({
        email
    })

    if (user && user?.verified != true) {

        user.otp = otp
        user.otpExp = otpExp
        await user?.save()
        await sendVerifyEmail(email, otp.toString())

        return res.status(200).json(
            new ApiResponse(true,"Please Verify Your Account !")
        )
    } 
    if(user && user?.verified == true){

        user.otp = otp
        user.otpExp = otpExp
        await user.save()
        await sendVerifyEmail(email, otp.toString())
        
        return res.status(200).json(
            new ApiResponse(true,"Please Enter the Otp !")
        )
    }

    const register = await User.create({
        email,
        otp,
        otpExp
    })

    if (!register) {
        throw new ApiError(500,"Server Failed to Regiser the User !")
    }

    await sendVerifyEmail(email, otp.toString())

    return res.status(200).json(
        new ApiResponse(true, "User Register Successfully - Please Verify Your Email !")
    )
}

const verifyUser = async (req: Request, res: Response) => {
    const { email, otp } = req.body

    if (!email) {
        throw new ApiError(400,"Email is Required !")
    }
    if (!otp) {
        throw new ApiError(400,"Otp is Required !")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404,"User Not Found !")
    }

    user.verified = true
    user.otp = undefined
    user.otpExp = undefined
    await user.save()

    return res.status(200).json(
        new ApiResponse(true, "User Verified Successfully !")
    )
}

export {
    loginUser,
    verifyUser
}