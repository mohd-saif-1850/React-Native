import { Router } from "express";
import { completeTask, createTask, deleteTask, getAllTask, getTask } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.route("/create-task").post(authMiddleware,createTask)
router.route("/complete-task").patch(authMiddleware,completeTask)
router.route("/delete-task").delete(authMiddleware,deleteTask)
router.route("/get-task").get(authMiddleware,getTask)
router.route("/get-all-tasks").get(authMiddleware,getAllTask)

export default router;