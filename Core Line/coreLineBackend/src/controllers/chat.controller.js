import { Chat } from "../models/chat.model.js"
import { User } from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

const createChat = async (req, res) => {
  const { receiverUsername } = req.body
  const userId = req.userId

  if (!receiverUsername) {
    throw new apiError(400, "Receiver username required")
  }

  const receiver = await User.findOne({ username: receiverUsername })

  if (!receiver) {
    throw new apiError(404, "Receiver not found")
  }

  if (receiver._id.toString() === userId) {
    throw new apiError(400, "You cannot chat with yourself")
  }

  let chat = await Chat.findOne({
    participants: { $all: [userId, receiver._id] }
  })

  if (chat) {
    return res.status(200).json(
      new apiResponse(200, "Chat already exists", chat)
    )
  }

  chat = await Chat.create({
    participants: [userId, receiver._id]
  })

  return res.status(201).json(
    new apiResponse(201, "Chat created successfully", chat)
  )
}


const getMyChats = async (req, res) => {
  const userId = req.userId

  const chats = await Chat.find({
    participants: userId
  })
    .populate("participants", "username image")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })

  return res.status(200).json(
    new apiResponse(200, "Chats fetched", chats)
  )
}


export {
    createChat,
    getMyChats
}