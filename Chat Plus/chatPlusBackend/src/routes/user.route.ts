import { Router } from "express";
import { deleteUser, getLastSeen, getOnlineStatus, loginUser, tutorial, updateImage, updateUser, verifyUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer";

const router = Router()

router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)
router.route("/update-user").patch(isAuthenticated,updateUser)
router.route("/delete-user").delete(isAuthenticated,deleteUser)
router.route("/tutorial").delete(isAuthenticated,tutorial)
router.route("/update-image").patch(isAuthenticated,upload.single("file"),updateImage)
router.route("/last-seen/:id").get(isAuthenticated,getLastSeen)
router.route("/online/:id").get(isAuthenticated,getOnlineStatus)

export default router;