import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createFeedback, deleteFeedback, getAllFeedbacks } from "../controllers/feedback.controller.js";

const router = Router()

router.route("/create-feedback").post(isAuthenticated,createFeedback)
router.route("/delete-feedback/:id").delete(isAuthenticated,deleteFeedback)
router.route("/get-all-feedbacks").get(isAuthenticated,getAllFeedbacks)

export default router;