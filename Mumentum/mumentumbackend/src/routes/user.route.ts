import { Router } from "express";
import { deleteUser, getUser, githubCallback, redirectToGithub, updateImage, updateUser } from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.route("/github-login").get(redirectToGithub)
router.route("/github-callback").get(githubCallback)

router.route("/update-details").patch(authMiddleware,updateUser)
router.route("/update-image").patch(authMiddleware,upload.single("file"),updateImage)
router.route("/delete-user").delete(authMiddleware,deleteUser)
router.route("/get-user").get(authMiddleware,getUser)

export default router;