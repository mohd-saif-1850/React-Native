import { Router } from "express"
import { getMessagesByChat } from "../controllers/message.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/:chatId", verifyJwt, getMessagesByChat)

export default router
