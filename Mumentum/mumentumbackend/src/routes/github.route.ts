import { Router } from "express";
import { getGithubProfileInsights } from "../controllers/github.controller";

const router = Router()

router.route("/profile-insights").get(getGithubProfileInsights)

export default router;