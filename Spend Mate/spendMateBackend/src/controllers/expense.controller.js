import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js"
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'

const createExpense = async (req,res) => {
    const {title, amount, category, date, time, discription, otherCategory} = req.body
    const userId = req.user._id

    if (!userId) {
        throw new apiError(404,"User Id is Required - Please Login In First !")
    }
    if (!title) {
        throw new apiError(404,"Title is Required !")
    }
    if (!amount) {
        throw new apiError(404,"Amount is Required !")
    }
    if (!category) {
        throw new apiError(404,"Category is Required !")
    }

    // const notDateProvided = 

    const expense = await Expense.create({
        userId,
        title,
        amount,
        category,
        otherCategory : otherCategory ? otherCategory : "",
        discription,
        date,
        time

    })

    if (!expense) {
        throw new apiError(500,"Server Failed to Create Expense !")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new apiError(404,"User Not Found !")
    }

    const expenseMonth = new Date(date).getMonth();
    const expenseYear = new Date(date).getFullYear();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    user.totalSpend = Number(user.totalSpend) + Number(amount)
    if (expenseMonth === currentMonth && expenseYear === currentYear) {
        user.monthSpend = Number(user.monthSpend) + Number(amount);
    }
    
    await user.save()

    return res.status(200).json(
        new apiResponse(200,`Expense Created Successfully with Title ${title} !`,expense)
    )
    
}

const updateExpense = async (req,res) => {
    const { id } = req.params;
    const { title, amount, category, time, discription } = req.body;
    const userId = req.user._id;

    if (!id) {
        throw new apiError(404,"Expense Id is Required !");
    }

    const expense = await Expense.findOne({_id: id, userId});

    if (!expense) {
        throw new apiError(404,"Expense Not Found !");
    }

    // only update if provided
    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (time) expense.time = time;
    if (discription) expense.discription = discription;

    await expense.save();

    return res.status(200).json(
        new apiResponse(200,"Expense Updated Successfully !",expense)
    )
}

const deleteExpense = async (req,res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
        throw new apiError(404,"Expense Id is Required !");
    }

    const expense = await Expense.findOne({_id: id, userId});

    if (!expense) {
        throw new apiError(404,"Expense Not Found !");
    }

    const deletedAmount = expense.amount;

    await Expense.deleteOne({_id: id});

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404,"User Not Found !");
    }

    user.totalSpend = Number(user.totalSpend) - Number(deletedAmount);

    await user.save();

    return res.status(200).json(
        new apiResponse(200,"Expense Deleted Successfully !",{})
    )
}

const getUserExpenses = async (req,res) => {
    const userId = req.user._id;

    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200,"Fetched All Expenses !",expenses)
    )
}

const getMonthlyExpenses = async (req,res) => {
    const userId = String(req.user._id);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear(); 

    const expenses = await Expense.find({ userId });

    const monthlyExpenses = expenses.filter(item => {
        const expenseMonth = Number(item.date.split("-")[1]);
        const expenseYear = Number(item.date.split("-")[0]);
        return (expenseMonth === currentMonth && expenseYear === currentYear);
    });

    const totalMonthSpend = monthlyExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404,"User Not Found !");
    }

    user.monthSpend = totalMonthSpend;

    await user.save();

    return res.status(200).json(
        new apiResponse(200,"Monthly Expenses Calculated Successfully !",{
            month: currentMonth,
            year: currentYear,
            monthlyExpenses,
            totalMonthSpend
        })
    )
}

const getTotalExpenses = async (req,res) => {
    const userId = req.user._id;

    const expenses = await Expense.find({ userId });

    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404,"User Not Found !");
    }

    user.totalSpend = total;

    await user.save();

    return res.status(200).json(
        new apiResponse(200,"Total Expenses Calculated Successfully !", { total })
    )
}


export {
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyExpenses,
    getUserExpenses,
    getTotalExpenses
}