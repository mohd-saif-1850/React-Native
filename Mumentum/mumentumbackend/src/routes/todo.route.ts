import { Router } from "express";
import { createTask } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.route("/create-task").post(authMiddleware,createTask)

export default router;