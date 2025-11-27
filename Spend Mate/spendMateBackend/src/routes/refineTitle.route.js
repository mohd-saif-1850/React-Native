import express from "express";
import { refineTitle } from "../controllers/refineTitle.controller.js";
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router();

router.route("/refine-title").post(isAuthenticated,refineTitle);

export default router;
