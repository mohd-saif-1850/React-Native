import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createChat, getMyChats } from "../controllers/chat.controller.js";
import { Router } from "express";

const router = Router()

router.route("/create-chat").post(verifyJwt,createChat)
router.route("/get-chats").get(verifyJwt,getMyChats)

export default router