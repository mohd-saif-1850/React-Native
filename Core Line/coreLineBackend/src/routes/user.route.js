import { Router } from "express"
import { loginUser, registerUser, updatePic } from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/upload.middleware.js"

const router = Router()

router.route("/register-user").post(registerUser)
router.route("/login-user").post(loginUser)
router.route("/update-pic").patch(verifyJwt,upload.single("file"),updatePic)

export default router;