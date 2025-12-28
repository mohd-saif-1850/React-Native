import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { Request, Response } from "express";
import axios from "axios"
import uploadToCloudinary from "../utils/uploadToCloudinary";
import cloudinary from "../utils/cloudinary";
import bcrypt from "bcryptjs"

const redirectToGithub = (req: Request, res: Response) => {
  const githubAuthUrl = 
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/v1/user/github-callback&scope=user:email`;

  res.redirect(githubAuthUrl);
};

const githubCallback = async (req: Request, res: Response) => {
    const { code } = req.query

    if (!code) {
        throw new apiError(404,"Code not Provided !")
    }

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: "application/json"
                }
            }
        )

         const accessToken = tokenResponse.data.access_token

         if (!accessToken) {
            throw new apiError(401,"Failed to get Access Token !")
         }

         const githubUserRes = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
         )

         const githubUser = githubUserRes.data

         let user = await User.findOne({ githubId: githubUser.id})
         const randomNumber = Math.floor(Math.random() * 100) + 1

         if (!user) {
            user = await User.create({
                name: githubUser.name || githubUser.login || "Unknown",
                username: `${githubUser.login}_github${randomNumber}`,
                profilePic: githubUser.avatar_url,
                githubId: githubUser.id,
                verified: true
            })
         }

         const token = await generateToken(user._id)

         return res.status(200).json(
            new apiResponse(200,`User created successfully !`,{
                token
            })
         )
    } catch (error) {
        console.log(`Errors in GithubCallback : ${error}`)
        return res.status(400).json(
            new apiResponse(400,"Login Failed !")
        )
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { name, username, email, gender, dob} = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }

    if (name) {
        user.name = name
    }
    if (username) {
        const existedUser = await User.findOne({
            username,
            _id: { $ne: userId }
        });
        if (existedUser) {
            throw new apiError(400,"Username Already Taken - Try to Different Username !")
        } else {
            user.username = username
        }
    }
    if (email) {
        user.email = email
    }
    if (gender) {
        user.gender = gender
    }
    if (dob) {
        user.dob = dob
    }
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"User Updated Successfully !")
    )
}

const updateImage = async (req: Request, res: Response) => {
    const userId = req.userId
    const file = req.file

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!file) {
        throw new apiError(404,"File not provided !")
    }
    
    if (file.size > 10 * 1024 * 1024) {
        throw new apiError(400,"File must be less than 10MB !")
    }

    try {
        const filePath = req.file?.path
    
        const image = await uploadToCloudinary(filePath)
    
        if (!image) {
            throw new apiError(404,"File not found !")
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new apiError(401,"User not Found !")
        }

        if (user.profilePicId) {
            const deletePic = await cloudinary.uploader.destroy(user.profilePicId)
        }

        user.profilePic = image.secure_url
        user.profilePicId = image.public_id
        await user.save()

        return res.status(200).json(
            new apiResponse(200,"File Uploaded Successfully !")
        )
    } catch (error) {
        console.log("Error While Uploading the File : ",error)
        return res.status(400).json(
            new apiResponse(401,"Some error while uploading the file in cloudinary !",error)
        )
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }

    try {
        const user = await User.findByIdAndDelete(userId)
        
        if (!user) {
            throw new apiError(500,"Server Failed to Delete a User !")
        }
    
        return res.status(200).json(
            new apiResponse(200,"User deleted successfully !")
        )
    } catch (error) {
        console.log("Error in Deleting Route : ",error)
        return res.status(401).json(
            new apiResponse(401,"Some problem occured in the Delete User !",error)
        )
    }
}

const acceptChallenge = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }

    const user = await User.findByIdAndUpdate(userId,{
        challenge: true
    },{ new: true })

    if (!user) {
        throw new apiError(401,"User not found !")
    }

    return res.status(200).json(
        new apiResponse(200,"User challenges begin now !")
    )
}

const getUser = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(500,"Server Failed to Fetch a User !")
    }

    return res.status(200).json(
        new apiResponse(200,"User fetched successfully !",user)
    )
}

const registerWithEmail = async (req: Request, res: Response) => {
    const {name, username, email, password} = req.body

    if (!name) {
        throw new apiError(404,"Name is Required !")
    }
    if (!username) {
        throw new apiError(404,"Username is Required !")
    }
    if (!email) {
        throw new apiError(404,"Email is Required !")
    }
    if (!password) {
        throw new apiError(404,"Password is Required !")
    }

    const existedUser = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if (existedUser && existedUser.verified) {
        throw new apiError(401,`User already exists either from username ${username} or from email ${email} !`)
    }
    if (existedUser && !existedUser.verified) {
        throw new apiError(401,`User already exists either from username ${username} or from email ${email} please verify your account !`)
    }

    const result = await axios.post(`${process.env.MUMENTUM_OTP}/verification`,{
        username,
        email
    })

    if (result && !result.data.status) {
        throw new apiError(403,"Some problem occured while sending the Otp !")
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const otp = result.data?.data
    const otpExp = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        otp,
        otpExp,
        verified: false
    })

    if (!user) {
        throw new apiError(500,"Server failed to create the user !")
    }

    return res.status(200).json(
        new apiResponse(200,`User created successfully with username ${username} !`,{
            username, email
        })
    )
}

const verifyEmail = async (req: Request, res: Response) => {
    const {identifier, otp} = req.body

    if (!identifier) {
        throw new apiError(404,"Username or Email is required !")
    }
    if (!otp) {
        throw new apiError(404,"Otp is required !")
    }

    const user = await User.findOne({
        $or: [
            {username: identifier},
            {email: identifier}
        ]
    })

    if (!user) {
        throw new apiError(401,`User not exist with this ${identifier} !`)
    }
    if (user.verified) {
        throw new apiError(404,"User is already verified !")
    }
    if (!user.otp || !user.otpExp) {
        throw new apiError(400, "OTP not found or already used")
    }
    if (user.otpExp && user.otpExp < new Date()) {
        throw new apiError(404,"Otp is expired - Please request for a new one !")
    }
    if (otp != user.otp) {
        throw new apiError(404,"Incorrect otp !")
    }

    user.otp = undefined,
    user.otpExp = undefined,
    user.verified = true
    await user.save()

    const token = await generateToken(user._id)

    return res.status(200).json(
        new apiResponse(200,`${user.username} verified successfully !`, token)
    )
}

const resendEmailOtp = async (req: Request, res: Response) => {
    const {username, email} = req.body

    if (!(username || email)) {
        throw new apiError(404,"Username or Email is required !")
    }

    const user = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if (!user) {
        throw new apiError(401,`User not exist neither from username ${username} nor from email ${email} !`)
    }
    if (user.verified) {
        throw new apiError(404,"User already verified !")
    }
    if (user.otpExp && user.otpExp > new Date(Date.now() - 2 * 60 * 1000)) {
        throw new apiError(429, "Please wait before requesting another OTP")
    }

    const newOtp = await axios.post(`${process.env.MUMENTUM_OTP}/verification`,{
        username,
        email
    })

    if (!newOtp.data?.data) {
        throw new apiError(404,"Error occured while sending the new otp !")
    }

    const newOtpExp = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = newOtp.data.data
    user.otpExp = newOtpExp
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Otp send successfully !")
    )
}

const forgotPassword = async (req: Request, res: Response) => {
    const {username, email} = req.body

    if (!username) {
        throw new apiError(404,"Username is required !")
    }
    if (!email) {
        throw new apiError(404,"Email is required !")
    }

    const user = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if (!user) {
        throw new apiError(401,`User not exist neither from username ${username} nor from email ${email} !`)
    }
    if (!user.verified) {
        throw new apiError(404,"User not verified !")
    }

    const result = await axios.post(`${process.env.MUMENTUM_OTP}/forgot-password`,{
        username,
        email
    })

    if (!result.data.data) {
        throw new apiError(409,"Error occured while sending the email !")
    }

    const exp = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = result.data.data
    user.otpExp = exp
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Email sent successfully !",{
            username,
            email
        })
    )
}

const verifyForgotOtp = async (req: Request, res: Response) => {
    const { identifier, otp} = req.body

    if (!identifier) {
        throw new apiError(404,"Username or Email is required !")
    }
    if (!otp) {
        throw new apiError(404,"Otp is required !")
    }

    const user = await User.findOne({
        $or: [
            {username: identifier},
            {email: identifier}
        ]
    })

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (otp !== user.otp) {
        throw new apiError(404,"Incorrect otp !")
    }
    if (user.otpExp && user.otpExp < new Date()) {
        throw new apiError(404,"Otp expired - Please request a new one !")
    }

    user.otp = undefined
    user.otpExp = undefined;
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Otp verified !",user.username)
    )
}

const resetPassword = async (req: Request, res: Response) => {
    const { username, password} = req.body

    if (!username) {
        throw new apiError(404,"User required !")
    }
    if (!password) {
        throw new apiError(404,"Password required !")
    }

    const newPassword = await bcrypt.hash(password,10)

    const user = await User.findOne({username})

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (user.otp) {
        throw new apiError(404,"No request for reset email !")
    }

    user.password = newPassword
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"User password updated successfully !")
    )
}

const login = async (req: Request, res: Response) => {
    const { identifier, password} = req.body

    if (!identifier) {
        throw new apiError(404,"Email or Username required !")
    }
    if (!password) {
        throw new apiError(404,"Password required !")
    }

    const user = await User.findOne({
        $or: [
            {username: identifier},
            {email: identifier}
        ]
    })

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.password) {
        throw new apiError(404,"Password not found !")
    }

    const correctPassword = await bcrypt.compare(password,user.password)

    if (!correctPassword) {
        throw new apiError(404,"Incorrect password !")
    }

    const token = await generateToken(user._id)

    return res.status(200).json(
        new apiResponse(200,"Login successfully !",{
            token
        })
    )
}

export {
    redirectToGithub,
    githubCallback,
    updateUser,
    updateImage,
    deleteUser,
    getUser,
    acceptChallenge,
    registerWithEmail,
    verifyEmail,
    resendEmailOtp,
    forgotPassword,
    verifyForgotOtp,
    resetPassword,
    login
}