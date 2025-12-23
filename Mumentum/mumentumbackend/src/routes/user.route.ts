import { Router } from "express";
import { githubCallback, redirectToGithub, updateImage, updateUser } from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";

const router = Router()

router.route("/github-login").get(redirectToGithub)
router.route("/github-callback").get(githubCallback)

router.route("/update-details").patch(updateUser)
router.route("/update-image").patch(upload.single("file"),updateImage)

export default router;