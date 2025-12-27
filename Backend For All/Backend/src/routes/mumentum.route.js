import { Router } from "express"
import { forgotPassword, verification } from "../controllers/mumentum.controller.js";

const router = Router()

router.route("/verification").post(verification)
router.route("/forgot-password").post(forgotPassword)

export default router;