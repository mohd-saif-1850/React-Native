import { User } from "../models/user.model";
import { Challenge } from "../models/challenge.model";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";
import { Request, Response } from "express";
import { Submission } from "../models/submissionChallenge.model";
import { Types } from "mongoose";

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
    const { challengeId } = req.body

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id required !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.challenge) {
        throw new apiError(404,"First accept the challenges !")
    }

    const challenge = await Challenge.findById(challengeId)

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }
    if (challenge.participants?.some(
        id => id.toString() === userId.toString()
    )) {
        throw new apiError(409, "You already joined this challenge")
    }
    // Now challenge status understand !
    if (challenge.challengeStatus === "upcoming") {
        throw new apiError(402,"This challenge not started yet !")
    } else if (challenge.challengeStatus === "expired") {
        throw new apiError(402,"This challenge is expired !")
    } else if (challenge.challengeStatus === "completed") {
        throw new apiError(402,"This challenge already completed !")
    } else if (challenge.challengeStatus === "filled") {
        throw new apiError(402,"Max participate joined the challenge !")
    }

    if (challenge.isPrivate) {
        throw new apiError(404,"Challenge is private !")
    }
    if (user.challengePoints && user.challengePoints < challenge.entryPoints) {
        throw new apiError(404,"You don't have enough challenge points to participate in this challenge - You can request to the devloper to get more challenge points !")
    }
    if ((challenge.participants?.length || 0) >= (challenge.totalParticipants || 20)) {
        throw new apiError(404,"Max participates already joined the challenge !")
    }
    if (challenge.start && challenge.start > new Date()) {
        throw new apiError(404,"Challenge is not started yet !")
    }
    if (challenge.end < new Date()) {
        throw new apiError(404,"Challenge already ended !")
    }

    challenge.participants?.push(new Types.ObjectId(userId))
    await challenge.save()

    user.challengePoints = user.challengePoints ? user.challengePoints - challenge.entryPoints : 0
    await user.save()

    return res.status(200).json(
        new apiResponse(200,"Challenge Joined successfully !")
    )
}

const submitAnswer = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, answer} = req.body

    if (!userId) {
        throw new apiError(404,"User Id required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id required !")
    }
    if (!answer) {
        throw new apiError(404,"Answer required !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(401,"User not found !")
    }
    if (!user.challenge) {
        throw new apiError(404,"First accept the challenges !")
    }

    const challenge = await Challenge.findById(challengeId)

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    const existedAnswer = await Submission.findOne({
        challengeId,
        userId
    })

    if (existedAnswer) {
        throw new apiError(404,"You already submitted the answer !")
    }

    const submission = await Submission.create({
        userId,
        challengeId,
        answer
    })

    if (!submission) {
        throw new apiError(500,"Server failed to submit a answer !")
    }

    return res.status(200).json(
        new apiResponse(200,"Answer submitted successfully !")
    )
}

const updateAnswer = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, submissionId} = req.query
    const { answer } = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!submissionId) {
        throw new apiError(404,"Submission Id is required !")
    }
    if (!answer) {
        throw new apiError(404,"No answer provided to update !")
    }

    const participate = await Submission.findOne({
        _id: submissionId,
        challengeId,
        userId
    })

    if (!participate) {
        throw new apiError(401,"You have not participated in this challenge !")
    }
    if (participate.status !== "submitted") {
        throw new apiError(404,"Answer already reviewed !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId
    })

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    participate.answer = answer
    await participate.save()

    return res.status(200).json(
        new apiResponse(200,"Answer updated successfully !")
    )
}

const getChallenge = async (req: Request,res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const challenge = await Challenge.findById(challengeId)

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }
    if (challenge.isPrivate) {
        throw new apiError(409,"Challenge is private - Only the owner can see !")
    }

    return res.status(200).json(
        new apiResponse(200,"Challenge fetched successfully !",challenge)
    )
}

const getAllChallenges = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const challenges = await Challenge.find({ isPrivate: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    return res.status(200).json(
        new apiResponse(200,"Challenges fetched successfully !",challenges)
    )
}

const getAllChallengesByDifficulty = async (req: Request, res: Response) => {
    const userId = req.userId
    const { difficulty } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const challenges = await Challenge.find({ isPrivate: false, difficulty })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    return res.status(200).json(
        new apiResponse(200,`${difficulty} challenges fetched successfully !`,challenges)
    )
}

const getUserChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    if (!challenge) {
        throw new apiError(402,"Challenge not found !")
    }

    return res.status(200).json(
        new apiResponse(200,"Challenge fetched successfully !",challenge)
    )
}

const getUserAllChallenges = async( req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }

    const challenges = await Challenge.find({
        owner: userId
    })

    return res.status(200).json(
        new apiResponse(200,"Your challenges fetched successfully !",challenges)
    )
}

const deleteChallenge = async ( req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const deletion = await Challenge.findOneAndDelete({
        _id: challengeId,
        owner: userId
    })

    if (!deletion) {
        throw new apiError(500,"Server failed to delete a challenge !")
    }

    return res.status(200).json(
        new apiResponse(200,"Challenge deleted successfully !")
    )
}

const updateChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query
    const { 
        title,
        category,
        challenge,
        difficulty,
        isPrivate,
        description
    } = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const challengeFind = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    if (!challengeFind) {
        throw new apiError(404,"Challenge not found !")
    }

    // Now from here i am doing the updation work
    if (title) {
        challengeFind.title = title
    }
    if (category) {
        challengeFind.category = category
    }
    if (challenge) {
        challengeFind.challenge = challenge
    }
    if (difficulty) {
        challengeFind.difficulty = difficulty
    }
    if (typeof isPrivate === "boolean") {
        challengeFind.isPrivate = isPrivate
    }
    if (description) {
        challengeFind.description = description
    }

    await challengeFind.save()

    return res.status(200).json(
        new apiResponse(200,"Challenge updated successfully !")
    )
}

const getSubmission = async (req: Request, res: Response) => {
    const userId = req.userId
    const { submissionId, challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!submissionId) {
        throw new apiError(404,"Submission Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const answer = await Submission.findOne({
        _id: submissionId,
        challengeId
    })

    if (!answer) {
        throw new apiError(404,"Answer not found !")
    }

    if (answer.userId.toString() !== userId.toString()) {
        const challenge = await Challenge.findOne({
            _id: challengeId,
            owner: userId
        })

        if (!challenge) {
            throw new apiError(403, "You are not allowed to view this submission")
        }
    }

    return res.status(200).json(
        new apiResponse(200,"Answer fetched successfully !",answer)
    )
}

const getAllSubmission = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId } = req.query

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    let answers

    if (challenge) {
        answers = await Submission.find({
            challengeId
        })
    } else {
        answers = await Submission.find({
            userId,
            challengeId
        })
    }

    return res.status(200).json(
        new apiResponse(200,"Answers fetched successfully !",answers)
    )
}

const reviewChallenge = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, submissionId } = req.query
    const { status, score, feedback} = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!submissionId) {
        throw new apiError(404,"Submission Id is required !")
    }
    if (!status) { 
        throw new apiError(404,"Status is required !")
    }

    const allowedStatus = ["reviewed","accepted","rejected"]

    if (!allowedStatus.includes(status)) {
        throw new apiError(404,"Invalid status value !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    const answer = await Submission.findOne({
        _id: submissionId,
        challengeId
    })

    if (!answer) {
        throw new apiError(401,"No answer found !")
    }
    if (answer.status !== "submitted") {
        throw new apiError(404,"Answer already reviewed !")
    }

    // Updation
    if (feedback) {
        answer.feedback = feedback
    }

    answer.status = status

    if (score !== undefined) {
        if (score < 0) {
            throw new apiError(404,"Score can't be negative !")
        } else {
            answer.score = score
        }
    }
    await answer.save()

    if (!challenge.completedBy?.includes(answer.userId)) {
        challenge.completedBy?.push(answer.userId)
        await challenge.save()
    }

    return res.status(200).json(
        new apiResponse(200,"Answer reviewed successfully !")
    )
}

const updateReview = async (req: Request, res: Response) => {
    const userId = req.userId
    const { challengeId, submissionId } = req.query
    const { status, score, feedback} = req.body

    if (!userId) {
        throw new apiError(404,"User Id is required !")
    }
    if (!challengeId) {
        throw new apiError(404,"Challenge Id is required !")
    }
    if (!submissionId) {
        throw new apiError(404,"Submission Id is required !")
    }

    const challenge = await Challenge.findOne({
        _id: challengeId,
        owner: userId
    })

    if (!challenge) {
        throw new apiError(401,"Challenge not found !")
    }

    const answer = await Submission.findOne({
        _id: submissionId,
        challengeId
    })

    if (!answer) {
        throw new apiError(401,"Answer not found !")
    }
    if (answer.status === "submitted") {
        throw new apiError(404,"Answer is not reviewed yet !")
    }

    const allowedStatus = ["reviewed","accepted","rejected"]

    // Updation
    if (status) {
        if (!allowedStatus.includes(status)) {
            throw new apiError(404,"Invalid status value !")
        } else {
            answer.status = status
        }
    }
    if (score !== undefined) {
        if (score < 0) {
            throw new apiError(404,"Score can't be negative !")
        } else {
            answer.score = score
        }
    }
    if (feedback) {
        answer.feedback = feedback
    }
    await answer.save()

    return res.status(200).json(
        new apiResponse(200,"Review updated successfully !")
    )
}

export {
    createChallenge,
    joinChallenge,
    submitAnswer,
    updateAnswer,
    getChallenge,
    getAllChallenges,
    getAllChallengesByDifficulty,
    getUserChallenge,
    getUserAllChallenges,
    deleteChallenge,
    updateChallenge,
    getSubmission,
    getAllSubmission,
    reviewChallenge,
    updateReview
}