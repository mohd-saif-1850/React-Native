import express from "express";
import {
  refineDescriptionController,
  refineTitleController
} from "../controllers/refineTitle.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/refine-title", isAuthenticated, refineTitleController);
router.post("/refine-description", isAuthenticated, refineDescriptionController);

export default router;
