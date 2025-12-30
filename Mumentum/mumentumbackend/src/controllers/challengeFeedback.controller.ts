import { User } from "../models/user.model";
import { ChallengeFeedback } from "../models/challengeFeedback.model";
import { Challenge } from "../models/challenge.model";
import { Request, Response } from "express";
import apiError from "../helpers/apiError";
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

const deleteFeedback = async ( req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, feedbackId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!feedbackId) {
        throw new apiError(404,"Feedback Id is required !")
    }

    const submit = await ChallengeFeedback.findOne({
        _id: feedbackId,
        challengeId,
        userId
    })

    if (!submit) {
        throw new apiError(404,"Feedback not found !")
    }
    if (submit.status !== "submitted") {
        throw new apiError(402,"Feedback already reviewed !")
    }
    
    await submit.deleteOne()

    return res.status(200).json(
        new apiResponse(200,"Feedback deleted successfully !")
    )
}

const getFeedback = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, feedbackId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!feedbackId) {
        throw new apiError(404,"Feedback Id is required !")
    }

    const submit = await ChallengeFeedback.findOne({
        _id: feedbackId,
        challengeId
    })

    if (!submit) {
        throw new apiError(401,"Feedback not found !")
    }

    return res.status(200).json(
        new apiResponse(200,"Feedback fetched successfully !",submit)
    )
}

const getAllFeedback = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const submit = await ChallengeFeedback.find({
        challengeId
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

    return res.status(200).json(
        new apiResponse(200,"Feedback fetched successfully !",submit)
    )
}

const reviewFeedback = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, feedbackId } = req.query
    const { response, status, bonusPoints } = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!feedbackId) {
        throw new apiError(404,"Feedback Id is required !")
    }

    if (bonusPoints !== undefined && (bonusPoints > 10 || bonusPoints < 0)) {
        throw new apiError(404,"Bonus points can be given between 0 and 10 !")
    }

    const allowedStatus = ["reviewed","resolved"]

    if (status && !allowedStatus.includes(status)) {
        throw new apiError(404,"Invalid status value !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    const submit = await ChallengeFeedback.findOne({
        _id: feedbackId,
        challengeId
    })

    if (!submit) {
        throw new apiError(401,"Feedback not found !")
    }
    if (submit.status !== "submitted") {
        throw new apiError(402,"Feedback already reviewed !")
    }

    submit.response = response ?? "No response"
    submit.status = status ?? "reviewed"
    submit.bonusPoints = bonusPoints ?? 10;

    await submit.save()

    const user = await User.findByIdAndUpdate(submit.userId,{
        $inc: {
            challengePoints: submit.bonusPoints,
            bonusPoints: submit.bonusPoints
        }
    })

    return res.status(200).json(
        new apiResponse(200,"Feedback reviewed successfully !")
    )
}

export {
    submitFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedback,
    getAllFeedback,
    reviewFeedback
}