import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChallenge } from "../controllers/challenge.controller";

const router = Router()

router.route("/create-challenge").post(authMiddleware,createChallenge)

export default router;