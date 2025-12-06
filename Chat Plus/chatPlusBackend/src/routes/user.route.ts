import { Router } from "express";
import { loginUser, updateUser, verifyUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)
router.route("/update-user").patch(isAuthenticated,updateUser)

export default router;