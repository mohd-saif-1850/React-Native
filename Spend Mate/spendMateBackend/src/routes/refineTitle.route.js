import express from "express";
import { refineDescriptionController, refineTitleController } from "../controllers/refineTitle.controller.js";
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router();

router.route("/refine-title").post(isAuthenticated,refineTitleController);
router.route("/refine-description").post(isAuthenticated, refineDescriptionController);

export default router;
