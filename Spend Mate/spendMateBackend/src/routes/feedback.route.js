import { Router } from "express";
import { createFeedback, deleteFeedback, getAllFeedbacks } from "../controllers/feedback.controller.js";

const router = Router();

router.route("/create-feedback").post(createFeedback);
router.route("/delete-feedback/:id").delete(deleteFeedback);
router.route("/get-all-feedbacks").get(getAllFeedbacks);

export default router;
