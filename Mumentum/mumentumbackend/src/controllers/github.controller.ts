import { Request, Response } from "express";
import { User } from "../models/user.model";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import axios from "axios";

const getGithubProfileInsights = async ( req: Request,res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(401, "Unauthorized")
    }

    const user = await User.findById(userId)

    if (!user || !user.githubAccessToken) {
        throw new apiError(400, "GitHub account not connected")
    }

    const githubRes = await axios.get(
        "https://api.github.com/user",
        {
        headers: {
            Authorization: `Bearer ${user.githubAccessToken}`,
            Accept: "application/vnd.github+json"
        }
        }
    )

    const data = githubRes.data

    return res.status(200).json(
        new apiResponse(200, "GitHub profile insights fetched", {
        username: data.login,
        name: data.name,
        avatar: data.avatar_url,
        bio: data.bio,
        followers: data.followers,
        following: data.following,
        publicRepos: data.public_repos,
        joinedAt: data.created_at
        })
    )
}

// const getContributionInsights = async ( req: Request,res: Response) => {
    
// }

// const getLanguageInsights = async ( req: Request,res: Response) => {
    
// }

// const getRepositoryInsights = async ( req: Request,res: Response) => {
    
// }

// const getMomentumScore = async ( req: Request,res: Response) => {
    
// }

export {
    getGithubProfileInsights
    // getContributionInsights,
    // getLanguageInsights,
    // getRepositoryInsights,
    // getMomentumScore
}