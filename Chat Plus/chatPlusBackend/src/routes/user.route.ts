import { Router } from "express";
import { loginUser, verifyUser } from "../controllers/user.controller";

const router = Router()

router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)

export default router;