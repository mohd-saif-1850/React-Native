import { Router } from "express";
import { deleteUser, loginUser, tutorial, updateImage, updateUser, verifyUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer";

const router = Router()

router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)
router.route("/update-user").patch(isAuthenticated,updateUser)
router.route("/delete-user").delete(isAuthenticated,deleteUser)
router.route("/tutorial").delete(isAuthenticated,tutorial)
router.route("/update-image").patch(isAuthenticated,upload.single("file"),updateImage)

export default router;