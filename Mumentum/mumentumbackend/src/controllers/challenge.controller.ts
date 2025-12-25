import { User } from "../models/user.model";
import { Challenge } from "../models/challenge.model";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { Request, Response } from "express";

const createChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    const {
        category, 
        entryPoints, 
        challenge, 
        start, 
        end, 
        challengeStatus, 
        difficulty, 
        isPrivate,
        rewardPoints,
        description
    } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
}