import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { Request, Response } from "express";
import axios from "axios"
import uploadToCloudinary from "../utils/uploadToCloudinary";
import cloudinary from "../utils/cloudinary";

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

         if (!user) {
            user = await User.create({
                name: githubUser.name || githubUser.login || "Unknown",
                username: githubUser.login,
                profilePic: githubUser.avatar_url,
                githubId: githubUser.id
            })
         }

         const token = await generateToken(user._id)

         return res.status(200).json(
            new apiResponse(200,`User created successfully !`,{
                token,
                user
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
        new apiResponse(200,"User Updated Successfully !", user)
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
            new apiResponse(200,"File Uploaded Successfully !",user)
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
            new apiResponse(200,"User deleted successfully !",user)
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

const loginWithEmail = async (req: Request, res: Response) => {
    const { username, email} = req.body

    const result = await axios.post(`${process.env.MUMENTUM_OTP}/verification`,{
        username,
        email
    })

    if (!result) {
        throw new apiError(401,"Email is not send !")
    }

    console.log("Email Otp : ",result.data.data)

    return res.status(200).json(
        new apiResponse(200,"Email send successfully !",result.data.data)
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
    loginWithEmail
}