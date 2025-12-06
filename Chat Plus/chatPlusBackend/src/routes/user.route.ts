import { Router } from "express";
import { loginUser } from "../controllers/user.controller";

const router = Router()

router.route("/login-user").post(loginUser)

export default router;