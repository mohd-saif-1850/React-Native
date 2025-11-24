import { Router } from 'express'
import { isAuthenticated } from "../middleware/auth.js"
import { createExpense, deleteExpense, getMonthlyExpenses, getTotalExpenses, getUserExpenses, updateExpense } from '../controllers/expense.controller.js';

const router = Router()

//These routes are all Authenticated Boiiiiiiiiiiiiiiiii
router.route("/create-expense").post(isAuthenticated,createExpense)
router.route("/update-expense/:id").patch(isAuthenticated,updateExpense)
router.route("/delete-expense/:id").delete(isAuthenticated,deleteExpense)
router.route("/all-expenses").get(isAuthenticated,getUserExpenses)
router.route("/monthly-spend").get(isAuthenticated,getMonthlyExpenses)
router.route("/total-spend").get(isAuthenticated,getTotalExpenses)

export default router;