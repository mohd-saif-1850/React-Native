import { Router } from "express";
import { deleteUser, loginUser, tutorial, updateUser, verifyUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router()

router.route("/login-user").post(loginUser)
router.route("/verify-user").patch(verifyUser)
router.route("/update-user").patch(isAuthenticated,updateUser)
router.route("/delete-user").delete(isAuthenticated,deleteUser)
router.route("/tutorial").delete(isAuthenticated,tutorial)

export default router;