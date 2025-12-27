import { Router } from "express";
import { acceptChallenge, deleteUser, forgotPassword, getUser, githubCallback, loginWithEmail, redirectToGithub, resendEmailOtp, updateImage, updateUser, verifyEmail } from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.route("/github-login").get(redirectToGithub)
router.route("/github-callback").get(githubCallback)

router.route("/update-details").patch(authMiddleware,updateUser)
router.route("/update-image").patch(authMiddleware,upload.single("file"),updateImage)
router.route("/delete-user").delete(authMiddleware,deleteUser)
router.route("/get-user").get(authMiddleware,getUser)
router.route("/challenge").patch(authMiddleware,acceptChallenge)

router.route("/login-with-email").post(loginWithEmail)
router.route("/verify-email").patch(verifyEmail)
router.route("/resend-email-otp").patch(resendEmailOtp)
router.route("/forgot-password").patch(forgotPassword)

export default router;