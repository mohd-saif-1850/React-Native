import { Router } from "express";
import { redirectToGithub } from "../controllers/user.controller";

const router = Router()

router.route("/github-login").get(redirectToGithub)

export default router;