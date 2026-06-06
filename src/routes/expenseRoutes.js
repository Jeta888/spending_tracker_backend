const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getWeeklySummary,
} = require("../controllers/expenseController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);

router.get("/summary/monthly", getMonthlySummary);
router.get("/summary/weekly", getWeeklySummary);

router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;