import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChallenge, getAllChallenges, getAllChallengesByDifficulty, getChallenge, getUserChallenge, joinChallenge, submitAnswer } from "../controllers/challenge.controller";

const router = Router()

router.route("/create-challenge").post(authMiddleware,createChallenge)
router.route("/join-challenge").patch(authMiddleware,joinChallenge)

router.route("/submit-answer").post(authMiddleware,submitAnswer)

router.route("/get-challenge").get(authMiddleware,getChallenge)
router.route("/get-all-challenges").get(authMiddleware,getAllChallenges)
router.route("/get-all-challenges-by-difficulty").get(authMiddleware,getAllChallengesByDifficulty)

router.route("/get-user-challenge").get(authMiddleware,getUserChallenge)

export default router;