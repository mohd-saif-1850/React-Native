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

    const maxParticipants = totalParticipants ?? 20

    if (maxParticipants > 20 || maxParticipants < 5) {
        throw new apiError(404,"Total participants must be between 5 and 20 !")
    }

    const now = new Date()
    const startDate = start ? new Date(start) : now
    const endDate = new Date(end)
    if (startDate < now) {
        throw new apiError(400, "Start date cannot be in the past")
    }
    if (endDate <= startDate) {
        throw new apiError(400, "End date must be after start date")
    }

    const user = await User.findById(userId)
    
    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (user && !user.challenge) {
        throw new apiError(404,"First start the challenge !")
    }
    if (user && !user.subscription) {
        throw new apiError(401,"Subscription required to create a Challenge !")
    }

    const owner = user._id
    const finalPoints = points ?? 200
    const finalParticipants = maxParticipants

    const entryPoints = finalPoints / finalParticipants

    let rewardPoints = entryPoints * 3;
    if (!difficulty || difficulty === "easy") {
        rewardPoints = entryPoints * 3;
    } else if (difficulty === "medium") {
        rewardPoints = entryPoints * 5;
    } else if (difficulty === "hard") {
        rewardPoints = entryPoints * 10;
    }

    let challengeStatus;
    if (startDate > now) {
        challengeStatus = "upcoming"
    } else {
        challengeStatus = "active"
    }

    const challeneCreate = await Challenge.create({
        title,
        owner,
        challenge,
        points: finalPoints,
        entryPoints,
        category,
        start,
        end,
        description,
        challengeStatus,
        totalParticipants: maxParticipants,
        difficulty,
        isPrivate,
        rewardPoints
    })

    if (!challeneCreate) {
        throw new apiError(500,"Server failed to create a Challenge !")
    }

    return res.status(200).json(
        new apiResponse(200,"Challenge created successfully !", challeneCreate)
    )
}

const joinChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    // const { challengeId, }
}

export {
    createChallenge
}