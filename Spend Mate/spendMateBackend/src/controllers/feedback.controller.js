import { Feedback } from '../models/feedback.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'

const createFeedback = async (req, res) => {
    const { name, email, message } = req.body

    if (!name) {
        throw new apiError(400, "Name is required")
    }
    if (!email) {
        throw new apiError(400, "Email is required")
    }
    if (!message) {
        throw new apiError(400, "Message is required")
    }

    const feedback = await Feedback.create({
        name,
        email,
        message
    })

    if (!feedback) {
        throw new apiError(500, "Server failed to create feedback")
    }

    return res.status(200).json(
        new apiResponse(200, "Feedback created successfully", feedback)
    )
}

const getAllFeedbacks = async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 })

    return res.status(200).json(
        new apiResponse(200, "All Feedbacks Fetched Successfully", feedbacks)
    )
}

const deleteFeedback = async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new apiError(400, "Feedback Id is required")
    }

    const deleted = await Feedback.findByIdAndDelete(id)

    if (!deleted) {
        throw new apiError(400, "Feedback Not Found or Already Deleted")
    }

    return res.status(200).json(
        new apiResponse(200, "Feedback Deleted Successfully", deleted)
    )
}

export {
    createFeedback,
    getAllFeedbacks,
    deleteFeedback
}
