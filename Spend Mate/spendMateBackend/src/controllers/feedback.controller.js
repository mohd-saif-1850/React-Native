import { Feedback } from '../models/feedback.model.js'
import { User } from '../models/user.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'

const createFeedback = async (req,res) => {
    const userId = req.user._id
    const { message } = req.body

    if (!userId) {
        throw new apiError(400,"Please Login First !")
    }
    if (!message) {
        throw new apiError(400,"Message is Required !")
    }

    const user = await User.findById(userId)
    
    if (!user) {
        throw new apiError(400,"User Not Found !")
    }

    const feedback = await Feedback.create({
        userId,
        email: user.email,
        message
    })

    if (!feedback) {
        throw new apiError(500,"Server Failed to Create Feedback !")
    }

    return res.status(200).json(
        new apiResponse(200,"Feedback Created Successfully !", feedback)
    )
}

const getAllFeedbacks = async (req,res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 })

    if (!feedbacks) {
        throw new apiError(400,"No Feedbacks Found !")
    }

    return res.status(200).json(
        new apiResponse(200,"All Feedbacks Fetched Successfully !", feedbacks)
    )
}

const deleteFeedback = async (req,res) => {
    const { id } = req.params

    if (!id) {
        throw new apiError(400,"Feedback Id is Required !")
    }

    const deleted = await Feedback.findByIdAndDelete(id)

    if (!deleted) {
        throw new apiError(400,"Feedback Not Found or Already Deleted !")
    }

    return res.status(200).json(
        new apiResponse(200,"Feedback Deleted Successfully !", deleted)
    )
}

export {
    createFeedback,
    getAllFeedbacks,
    deleteFeedback
}
