import { Message } from "../models/message.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

const getMessagesByChat = async (req, res) => {
  const { chatId } = req.params

  if (!chatId) {
    throw new apiError(400, "ChatId required")
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })

  return res.status(200).json(
    new apiResponse(200, "Messages fetched", messages)
  )
}

export { getMessagesByChat }
