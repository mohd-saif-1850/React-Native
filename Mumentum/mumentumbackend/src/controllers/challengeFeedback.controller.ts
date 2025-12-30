import { User } from "../models/user.model";
import { ChallengeFeedback } from "../models/challengeFeedback.model";
import { Challenge } from "../models/challenge.model";
import { Request, Response } from "express";
import apiError from "../helpers/apiError";
import { Types } from "mongoose";
import apiResponse from "../helpers/apiResponse";

const submitFeedback = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query
    const { feedback } = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!feedback) {
        throw new apiError(404,"Feedback is required !")
    }

    const existedFeedback = await ChallengeFeedback.findOne({
        userId,
        challengeId
    })

    if (existedFeedback) {
        throw new apiError(402,"Already submitted feedback !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.challenge) {
        throw new apiError(401,"User not started challenge yet !")
    }

    const challenge = await Challenge.findById(challengeId)

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    const submit = await ChallengeFeedback.create({
        userId: user._id,
        challengeId: challenge._id,
        feedback
    })

    if (!submit) {
        throw new apiError(500,"Server failed to submit feedback !")
    }

    return res.status(200).json(
        new apiResponse(200,"Feedback submitted successfully !")
    )
}

const updateFeedback = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, feedbackId } = req.query
    const { feedback } = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!feedbackId) {
        throw new apiError(404,"Feedback Id is required !")
    }
    if (!feedback) {
        throw new apiError(404,"Feedback not changed ! !")
    }

    const submit = await ChallengeFeedback.findOne({
        _id: feedbackId,
        userId,
        challengeId
    })

    if (!submit) {
        throw new apiError(401,"No feedback found !")
    }
    if (submit.status !== "submitted") {
        throw new apiError(404,"Feedback already reviewed !")
    }

    submit.feedback = feedback
    await submit.save()

    return res.status(200).json(
        new apiResponse(200,"Feedback updated successfully !")
    )
}

// Get, get all, delete and review are left

export {
    submitFeedback
}