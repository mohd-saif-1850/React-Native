import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createChallenge, deleteChallenge, getAllChallenges, getAllChallengesByDifficulty, getAllSubmission, getChallenge, getSubmission, getUserAllChallenges, getUserChallenge, joinChallenge, reviewChallenge, submitAnswer, updateAnswer, updateChallenge, updateReview } from "../controllers/challenge.controller";
import { submitFeedback } from "../controllers/challengeFeedback.controller";

const router = Router()

router.route("/create-challenge").post(authMiddleware,createChallenge)
router.route("/join-challenge").patch(authMiddleware,joinChallenge)
router.route("/delete-challenge").delete(authMiddleware,deleteChallenge)
router.route("/update-challenge").patch(authMiddleware,updateChallenge)

router.route("/submit-answer").post(authMiddleware,submitAnswer)
router.route("/update-answer").patch(authMiddleware,updateAnswer)
router.route("/get-answer").get(authMiddleware,getSubmission)
router.route("/get-all-answers").get(authMiddleware,getAllSubmission)

router.route("/get-challenge").get(authMiddleware,getChallenge)
router.route("/get-all-challenges").get(authMiddleware,getAllChallenges)
router.route("/get-all-challenges-by-difficulty").get(authMiddleware,getAllChallengesByDifficulty)

router.route("/get-user-challenge").get(authMiddleware,getUserChallenge)
router.route("/get-user-all-challenges").get(authMiddleware,getUserAllChallenges)

router.route("/review-challenge").patch(authMiddleware,reviewChallenge)
router.route("/update-review").patch(authMiddleware,updateReview)

router.route("/submit-feedback").post(authMiddleware,submitFeedback)

export default router;