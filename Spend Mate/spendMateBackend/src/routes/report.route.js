import { Router } from "express";
import { createReport, deleteReport } from "../controllers/report.controller.js";

const router = Router()

router.route("/create-report").post(createReport)
router.route("/delete-report/:id").delete(deleteReport)

export default router;