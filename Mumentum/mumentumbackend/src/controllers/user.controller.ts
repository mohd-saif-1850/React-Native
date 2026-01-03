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
    `https://github.com/login/oauth/authorize` +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=https://mumentum-backend.onrender.com/api/v1/user/github-callback` +
    `&scope=user:email`;

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
                username: `${githubUser.login}_${githubUser.id}`,
                profilePic: githubUser.avatar_url,
                githubId: githubUser.id,
                githubUsername: githubUser.login,
                githubAccessToken: accessToken,
                verified: true
            })
         } else {
            user.githubUsername = githubUser.login
            user.githubAccessToken = accessToken
            await user.save()
         }

         const token = await generateToken(user._id)

         return res.redirect(`mumentum://auth?token=${token}`);
    } catch (error) {
        console.log(`Errors in GithubCallback : ${error}`)
        return res.redirect("mumentum://auth?error=login_failed");
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { name, username, gender, dob} = req.body
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
        throw new apiError(404,"User Id is required !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404,"User not found !")
    }

    if (user.deletion) {
        throw new apiError(400,"User deletion already requested !")
    }

    user.deletion = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"User deletion scheduled successfully !")
    )
}

const undoDeleteUser = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404,"User not found !")
    }

    if (!user.deletion) {
        throw new apiError(400,"User deletion is not requested !")
    }

    user.deletion = undefined
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"User deletion cancelled successfully !")
    )
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

    const user = await User.findById(userId).select("-password -otp -otpExp")

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

    if (result && !result.data.success) {
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
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
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

    user.otp = undefined
    user.otpExp = undefined
    user.expiresAt = undefined
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
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = newOtp.data.data
    user.otpExp = newOtpExp
    user.expiresAt = expires
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

const updateEmail = async (req: Request, res: Response) => {
    const { email } = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id not found !")
    }
    if (!email) {
        throw new apiError(404,"Email required !")
    }

    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new apiError(200,"Email already linked with another account !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (user.email === email) {
        throw new apiError(404,"Account already have same email !")
    }

    const result = await axios.post(`${process.env.MUMENTUM_OTP}/verification`,{
        username: user.username,
        email
    })

    if (result && !result.data.success) {
        throw new apiError(403,"Some problem occured while sending the Otp !")
    }

    user.otp = result.data?.data
    user.otpExp = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    return res.status(200).json(
        new apiResponse(200,`Verify otp sent to your email ${email} !`,{
            email
        })
    )
}

const verifyUpdateEmail = async (req: Request, res: Response) => {
    const {email, otp} = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
    if (!email) {
        throw new apiError(404,"Email required !")
    }
    if (!otp) {
        throw new apiError(404,"Otp required !")
    }

    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new apiError(401,"Email already linked with another account !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.otp) {
        throw new apiError(404,"No request for chnage the email !")
    }
    if (user.otp !== otp) {
        throw new apiError(404,"Incorrect Otp !")
    }
    if (user.otpExp && user.otpExp < new Date()) {
        throw new apiError(404,"Otp expired - Please request a new one !")
    }

    user.otp = undefined
    user.otpExp = undefined
    user.email = email
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Email updated successfully !")
    )
}

const linkGithub = async (req: Request, res: Response) => {
    const { code } = req.query
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
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

         const existedGithubUser = await User.findOne({
            githubId: githubUser.id
         })

         const user = await User.findById(userId)

         if (!user) {
            throw new apiError(401,"User not found !")
         }
         if (user.githubId) {
            throw new apiError(404,"This account already linked with a github account !")
         }
         if (existedGithubUser) {
            throw new apiError(402,"This github account already linked with another account !")
         }

         user.githubId = githubUser.id
         await user.save()

         return res.status(200).json(
            new apiResponse(200,"Github linked successfully !")
         )
        
        } catch(error) {
            console.log("Error while linking the github with existing account : ",error)
            return res.status(400).json(
                new apiResponse(400,"Error while linking the github with existing account !",{
                    error
                })
            )
        }
}

const unlinkGithub = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(400,"User not found !")
    }
    if (!user.githubId) {
        throw new apiError(404,"No github account linked with this account !")
    }
    if (!user.email) {
        throw new apiError(404,"User not linked with any email - Please link your email first before doing this operation !")
    }

    user.githubId = undefined
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Github unlinked successfully !")
    )
}

const setPassword = async (req: Request, res: Response) => {
    const {password} = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
    if (!password) {
        throw new apiError(404,"Password required !")
    }
    
    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (user.password) {
        throw new apiError(404,"Password already set !")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Password set successfully !")
    )
}

const changePassword = async (req: Request, res: Response) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
    if (!oldPassword) {
        throw new apiError(404,"Old password required !")
    }
    if (!newPassword) {
        throw new apiError(404,"New password required !")
    }
    if (!confirmPassword) {
        throw new apiError(404,"Confirm password required !")
    }
    if (newPassword !== confirmPassword) {
        throw new apiError(404,"New password not mathced with confirm password !")
    }
    if (oldPassword === newPassword) {
        throw new apiError(404,"New password must be different from the old password !")
    }
    
    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.password) {
        throw new apiError(404,"No old password found !")
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword,user.password)

    if (!isPasswordCorrect) {
        throw new apiError(404,"Incorrect old password !")
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Password changed successfully !")
    )
}

export {
    redirectToGithub,
    githubCallback,
    updateUser,
    updateImage,
    deleteUser,
    undoDeleteUser,
    getUser,
    acceptChallenge,
    registerWithEmail,
    verifyEmail,
    resendEmailOtp,
    forgotPassword,
    verifyForgotOtp,
    resetPassword,
    login,
    updateEmail,
    verifyUpdateEmail,
    linkGithub,
    unlinkGithub,
    setPassword,
    changePassword
}