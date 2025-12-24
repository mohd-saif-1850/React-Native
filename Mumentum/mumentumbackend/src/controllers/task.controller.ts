import { User } from "../models/user.model";
import { Task } from "../models/task.model";
import { Request, Response } from "express";
import apiError from "../helpers/apiError";
import apiResponse from "../helpers/apiResponse";

const createTask = async (req: Request, res: Response) => {
    const { task } = req.body
    const userId = req.userId

    if (!userId) {
        throw new apiError(404,"Please Provide UserId - Try to Re-Login !")
    }
    if (!task) {
        throw new apiError(400,"Task must be provided !")
    }

    try {
        const taskCreate = await Task.create({
            userId,
            task
        })
    
        if (!taskCreate) {
            throw new apiError(402,"Task failed to create !")
        }
    
        return res.status(200).json(
            new apiResponse(200,"Task created successfully !",taskCreate)
        )
    } catch (error) {
        console.log("Error in creating task : ",error)
        return res.status(404).json(
            new apiResponse(404,"Failed to create the Task !",error)
        )
    }
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

    try {
        const task = await Task.findByIdAndUpdate(taskId,{
            $set: {
                completion: true
            }
        },{ new: true })
    
        const user = await User.findByIdAndUpdate(userId,{
            $inc: {
                points: 5
            }
        })

        if (!task) {
            throw new apiError(401,"Task not found !")
        }
    
        return res.status(200).json(
            new apiResponse(200,"Task completed successfully !",task)
        )
    } catch (error) {
        console.log("Some error in the completing the Task : ",error)
        return res.status(401).json(
            new apiResponse(401,"Error occured in completing the task !",error)
        )
    }
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

    const task = await Task.findByIdAndDelete(taskId)

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

    const task = await Task.findById(taskId)

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