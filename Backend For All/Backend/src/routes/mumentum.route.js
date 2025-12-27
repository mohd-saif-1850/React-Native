import { Router } from "express"
import { verification } from "../controllers/mumentum.controller.js";

const router = Router()

router.route("/verification").post(verification)

export default router;