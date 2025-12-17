import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createChat } from "../controllers/chat.controller.js";
import { Router } from "express";

const router = Router()

router.route("/create-chat").post(verifyJwt,createChat)

export default router