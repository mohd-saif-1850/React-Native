import { User } from "../models/user.model";
import { Request, Response } from "express";
import { sendVerifyEmail } from "../helpers/sendVerificationEmail";
import { ApiError } from "../helpers/apiError";
import { ApiResponse } from "../helpers/apiResponse";
import { generateToken } from "../helpers/jwt";

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
            new ApiResponse(true,"Please Verify Your Account !",user)
        )
    } 
    if(user && user?.verified == true){

        user.otp = otp
        user.otpExp = otpExp
        await user.save()
        await sendVerifyEmail(email, otp.toString())
        
        return res.status(200).json(
            new ApiResponse(true,"Please Enter the Otp !",user)
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
        new ApiResponse(true, "User Register Successfully - Please Verify Your Email !", user)
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

    if (otp != user.otp) {
        throw new ApiError(400,"Incorrect Otp !")
    }
    if (user.otpExp && user.otpExp.getTime() < Date.now()) {
        throw new ApiError(400, "OTP Expired - Please Generate new Otp !");
    }

    user.verified = true
    user.otp = undefined
    user.otpExp = undefined
    await user.save()

    const token = generateToken(user._id.toString(),email)

    return res.status(200).json(
        new ApiResponse(true, "User Verified Successfully !", {
            user,
            token
        })
    )
}

const updateUser = async (req: Request, res: Response) => {
    const { username, gender, name, about} = req.body
    const userId = req.userId

    if (!userId) {
        throw new ApiError(400,"User Id not Found - Please Login First !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(400,"User Not Found !")
    }

    user.username = username ? username : user.username
    user.gender = gender ? gender : user.gender
    user.name = name ? name : user.name
    user.about = about ? about : user.about
    await user.save()
    
    return res.status(200).json(
        new ApiResponse(true,"User Updated Successfully !",user)
    )
}

export {
    loginUser,
    verifyUser,
    updateUser
}