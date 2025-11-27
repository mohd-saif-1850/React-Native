import express from "express";
import { refineDescriptionController, refineTitle } from "../controllers/refineTitle.controller.js";
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router();

router.route("/refine-title").post(isAuthenticated,refineTitle);
router.post("/refine-description", isAuthenticated, refineDescriptionController);

export default router;
