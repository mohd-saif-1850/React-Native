import { User } from "../models/user.model";
import { Task } from "../models/task.model";
import { Request, Response } from "express";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";

const createTask = async (req: Request, res: Response) => {
    const userId = req.userId
    const { task } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!task) {
        throw new apiError(400,"Task must be provided !")
    }

    const taskCreate = await Task.create({
        userId,
        task,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })

    if (!taskCreate) {
        throw new apiError(402,"Task failed to create !")
    }

    return res.status(200).json(
        new apiResponse(200,"Task created successfully !",taskCreate)
    )
}

const completeTask = async (req: Request, res: Response) => {
    const userId = req.userId
    const { taskId } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!taskId) {
        throw new apiError(404,"Please provide the Task Id !")
    }

    const task = await Task.findOne({
        _id: taskId,
        userId
    })

    if (!task) {
        throw new apiError(401,"Task not found !")
    }
    if (task.completion) {
        throw new apiError(400,"Task already completed !")
    }

    task.completion = true
    task.isActive = false
    await task.save()

    await User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                points: 5
            }
        }
    )

    return res.status(200).json(
        new apiResponse(200,"Task completed successfully !",task)
    )
}

const deleteTask = async (req: Request, res: Response) => {
    const userId = req.userId
    const { taskId } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!taskId) {
        throw new apiError(404,"Please provide the Task Id !")
    }

    const task = await Task.findOneAndDelete({
        _id: taskId,
        userId
    })

    if (!task) {
        throw new apiError(401,"Task not found !")
    }

    return res.status(200).json(
        new apiResponse(200,"Task deleted successfully !",task)
    )
}

const getTask = async (req: Request, res: Response) => {
    const userId = req.userId
    const { taskId } = req.body

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!taskId) {
        throw new apiError(404,"Please provide the Task Id !")
    }

    const task = await Task.findOne({
        _id: taskId,
        userId
    })

    if (!task) {
        throw new apiError(401,"Task not found !")
    }

    return res.status(200).json(
        new apiResponse(200,"Task fetched successfully !",task)
    )
}

const getAllTask = async (req: Request, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }

    const task = await Task.find({
        userId
    })

    return res.status(200).json(
        new apiResponse(200,"All tasks fetched successfully !",task)
    )
}

export {
    createTask,
    completeTask,
    deleteTask,
    getTask,
    getAllTask
}
