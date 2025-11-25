import { Report } from '../models/report.model.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'

const createReport = async (req,res) => {
    const { name, email, issue } = req.body

    if (!name) {
        throw new apiError(400,"Name is Required !")
    }
    if (!email) {
        throw new apiError(400,"Email is Required !")
    }
    if (!issue) {
        throw new apiError(400,"Issue is Required !")
    }

    const report = await Report.create({
        name,
        email,
        issue
    })

    if (!report) {
        throw new apiError(500,"Server Failed to Create Report !")
    }

    return res.status(200).json(
        new apiResponse(200,"Report Submitted Successfully !", report)
    )
}

const deleteReport = async (req,res) => {
    const { id } = req.params

    if (!id) {
        throw new apiError(400,"Report Id is Required !")
    }

    const deleted = await Report.findByIdAndDelete(id)

    if (!deleted) {
        throw new apiError(400,"Report Not Found or Already Deleted !")
    }

    return res.status(200).json(
        new apiResponse(200,"Report Deleted Successfully !", deleted)
    )
}

export {
    createReport,
    deleteReport
}
