import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createChat, deleteForEveryone, deleteForMe, getAllChats, getMessages, markAsRead } from "../controllers/chat.controller";

const router = Router()

router.route("/create-chat").post(isAuthenticated,createChat)
router.route("/:roomId/messages").get(isAuthenticated,getMessages)
router.route("/all-chats").get(isAuthenticated,getAllChats)
router.route("/mark-as-read").post(isAuthenticated,markAsRead)
router.route("/delete-for-me").post(isAuthenticated,deleteForMe)
router.route("/delete-for-everyone").post(isAuthenticated,deleteForEveryone)

export default router;