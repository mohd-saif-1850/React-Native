import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';

const resetMonthSpendIfNewMonth = async (user) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastUpdatedMonth = user.updatedAt.getMonth();
    const lastUpdatedYear = user.updatedAt.getFullYear();

    if (currentMonth !== lastUpdatedMonth || currentYear !== lastUpdatedYear) {
        user.monthSpend = 0;
        await user.save();
    }
};

const createExpense = async (req, res) => {
    const { title, amount, category, date, time, discription, otherCategory } = req.body;
    const userId = req.user._id;

    if (!userId) throw new apiError(404, "User Id is Required - Please Login First !");
    if (!title) throw new apiError(404, "Title is Required !");
    if (!amount) throw new apiError(404, "Amount is Required !");
    if (!category) throw new apiError(404, "Category is Required !");

    const expense = await Expense.create({
        userId,
        title,
        amount,
        category,
        otherCategory: otherCategory ? otherCategory : "",
        discription,
        date,
        time
    });

    if (!expense) throw new apiError(500, "Server Failed to Create Expense !");

    const user = await User.findById(userId);
    if (!user) throw new apiError(404, "User Not Found !");

    await resetMonthSpendIfNewMonth(user);

    user.totalSpend = Number(user.totalSpend) + Number(amount);

    const expMonth = new Date(expense.date).getMonth();
    const expYear = new Date(expense.date).getFullYear();
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    if (expMonth === curMonth && expYear === curYear) {
        user.monthSpend += Number(amount);
    }

    await user.save();

    return res.status(200).json(
        new apiResponse(200, `Expense Created Successfully with Title ${title} !`, expense)
    );
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, time, discription, date } = req.body;
    const userId = req.user._id;

    if (!id) throw new apiError(404, "Expense Id is Required !");

    const expense = await Expense.findOne({ _id: id, userId });
    if (!expense) throw new apiError(404, "Expense Not Found !");

    const user = await User.findById(userId);
    if (!user) throw new apiError(404, "User Not Found !");

    await resetMonthSpendIfNewMonth(user);

    const oldAmount = Number(expense.amount);
    const oldMonth = new Date(expense.date).getMonth();
    const oldYear = new Date(expense.date).getFullYear();

    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (time) expense.time = time;
    if (discription) expense.discription = discription;
    if (date) expense.date = date;

    await expense.save();

    const newAmount = Number(expense.amount);
    const newMonth = new Date(expense.date).getMonth();
    const newYear = new Date(expense.date).getFullYear();

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    if (oldMonth === curMonth && oldYear === curYear) {
        user.monthSpend -= oldAmount;
    }

    if (newMonth === curMonth && newYear === curYear) {
        user.monthSpend += newAmount;
    }

    await user.save();

    return res.status(200).json(
        new apiResponse(200, "Expense Updated Successfully !", expense)
    );
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) throw new apiError(404, "Expense Id is Required !");

    const expense = await Expense.findOne({ _id: id, userId });
    if (!expense) throw new apiError(404, "Expense Not Found !");

    const user = await User.findById(userId);
    if (!user) throw new apiError(404, "User Not Found !");

    await resetMonthSpendIfNewMonth(user);

    const deletedAmount = Number(expense.amount);
    const expMonth = new Date(expense.date).getMonth();
    const expYear = new Date(expense.date).getFullYear();

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    if (expMonth === curMonth && expYear === curYear) {
        user.monthSpend -= deletedAmount;
    }

    user.totalSpend -= deletedAmount;

    await user.save();
    await Expense.deleteOne({ _id: id });

    return res.status(200).json(
        new apiResponse(200, "Expense Deleted Successfully !", {})
    );
};

const getUserExpenses = async (req, res) => {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, "Fetched All Expenses !", expenses)
    );
};

const getMonthlyExpenses = async (req, res) => {
    const userId = req.user._id;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const expenses = await Expense.find({ userId });

    const monthlyExpenses = expenses.filter(item => {
        const [y, m] = item.date.split("-").map(Number);
        return m === currentMonth && y === currentYear;
    });

    const totalMonthSpend = monthlyExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const user = await User.findById(userId);
    await resetMonthSpendIfNewMonth(user);

    user.monthSpend = totalMonthSpend;
    await user.save();

    return res.status(200).json(
        new apiResponse(200, "Monthly Expenses Calculated Successfully !", {
            month: currentMonth,
            year: currentYear,
            monthlyExpenses,
            totalMonthSpend
        })
    );
};

const getPreviousMonthExpenses = async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.subscription) {
        throw new apiError(403, "Subscription Required to View Custom Month Data !");
    }

    let { month, year } = req.body;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    month = Number(month) || currentMonth - 1;
    year = Number(year) || currentYear;

    if (!month || !year || month < 1 || month > 12) {
        throw new apiError(400, "Valid month (1-12) and year are required in body!");
    }

    const expenses = await Expense.find({ userId });

    const filtered = expenses.filter(item => {
        const dt = new Date(item.date);
        const m = dt.getMonth() + 1;
        const y = dt.getFullYear();
        return m === month && y === year;
    });

    return res.status(200).json(
        new apiResponse(200, "Custom Month Data Fetched Successfully !", {
            month,
            year,
            expenses: filtered
        })
    );
};


const getTotalExpenses = async (req, res) => {
    const userId = req.user._id;

    const expenses = await Expense.find({ userId });
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const user = await User.findById(userId);
    user.totalSpend = total;
    await user.save();

    return res.status(200).json(
        new apiResponse(200, "Total Expenses Calculated Successfully !", { total })
    );
};

export {
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyExpenses,
    getPreviousMonthExpenses,
    getUserExpenses,
    getTotalExpenses
};
