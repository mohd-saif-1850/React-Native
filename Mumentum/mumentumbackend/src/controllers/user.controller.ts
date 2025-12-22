import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { Request, Response } from "express";
import axios from "axios"

const redirectToGithub = async (req: Request, res: Response) => {
    const githubAuthUrl =
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;

    res.redirect(githubAuthUrl)
}

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



export {
    redirectToGithub,
    githubCallback
}