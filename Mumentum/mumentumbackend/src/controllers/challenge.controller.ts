import { User } from "../models/user.model";
import { Challenge } from "../models/challenge.model";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { Request, Response } from "express";

const createChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    const {
        title,
        category,
        totalParticipants,
        challenge, 
        points,
        start, 
        end, 
        challengeStatus, 
        difficulty, 
        isPrivate,
        description
    } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!category) {
        throw new apiError(404,"Category is Required !")
    }
    if (!end) {
        throw new apiError(404,"Ending date is Required !")
    }
    if (!challenge) {
        throw new apiError(404,"Challenge is Required !")
    }
    if (!title) {
        throw new apiError(404,"Title is Required !")
    }

    const user = await User.findById(userId)
    
    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (user && !user.challenge) {
        throw new apiError(404,"First start the challenge !")
    }
    const owner = user.username
    let entryPoints;
    if (!points && !totalParticipants) {
        entryPoints = 200 / 20;
    } else if (points && !totalParticipants) {
        entryPoints = points / 20;
    } else {
        entryPoints = points / totalParticipants;
    }

    let rewardPoints;
    if (!difficulty || difficulty === "easy") {
        rewardPoints = entryPoints * 3;
    } else if (difficulty === "medium") {
        rewardPoints = entryPoints * 5;
    } else if (difficulty === "hard") {
        rewardPoints = entryPoints * 10;
    }

    const challeneCreate = await Challenge.create({
        title,
        owner,
        challenge,
        points,
        entryPoints,
        category,
        start,
        end,
        description,
        challengeStatus,
        totalParticipants,
        difficulty,
        isPrivate,
        rewardPoints
    })

    if (!challeneCreate) {
        throw new apiError(500,"Server failed to create a Challenge !")
    }

    return res.status(200).json(
        new apiResponse(200,"Challenge created successfully !", createChallenge)
    )
}

export {
    createChallenge
}