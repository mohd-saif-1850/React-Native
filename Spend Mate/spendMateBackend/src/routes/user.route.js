import { Router } from 'express'
import { isAuthenticated } from "../middleware/auth.js"
import { upload } from "../middleware/multer.js"
import { createUser, deleteUser, getUser, loginUser, logoutUser, resetPassword, sendForgotEmail, tutorial, updateNPG, updateUser, verifyForgotOtp, verifyUser } from '../controllers/user.controller.js'


const router = Router()

router.route("/create-user").post(createUser)
router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)
router.route("/send-forgot-pass-email").post(sendForgotEmail)
router.route("/verify-forgot-otp").patch(verifyForgotOtp)
router.route("/reset-password").patch(resetPassword)
router.route("/get-user").patch(isAuthenticated,getUser)

//Authenticated Routes 
router.route("/update-user").patch(isAuthenticated,updateUser)
router.route("/logout-user").post(isAuthenticated,logoutUser)
router.route("/delete-user").delete(isAuthenticated,deleteUser)
router.route("/update-npg").patch(isAuthenticated,upload.single("profileUrl"),updateNPG)
router.route("/tutorial").patch(isAuthenticated,tutorial)

export default router;