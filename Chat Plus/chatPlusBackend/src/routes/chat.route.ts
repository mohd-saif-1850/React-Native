import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createChat, getAllChats, getMessages } from "../controllers/chat.controller";

const router = Router()

router.route("/create-chat").post(isAuthenticated,createChat)
router.route("/:roomId/messages").get(isAuthenticated,getMessages)
router.route("/all-chats").get(isAuthenticated,getAllChats)

export default router;