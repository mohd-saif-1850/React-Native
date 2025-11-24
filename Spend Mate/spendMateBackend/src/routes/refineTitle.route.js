import express from "express";
import { refineTitle } from "../controllers/refineTitle.controller.js";

const router = express.Router();

router.route("/refine-title").post(refineTitle);

export default router;
