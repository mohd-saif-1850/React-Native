import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChallenge, joinChallenge, submitAnswer } from "../controllers/challenge.controller";

const router = Router()

router.route("/create-challenge").post(authMiddleware,createChallenge)
router.route("/join-challenge").patch(authMiddleware,joinChallenge)

router.route("/submit-answer").post(authMiddleware,submitAnswer)

export default router;