const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createExpense,
  getExpenses,
  getMonthlySummary,
  getWeeklySummary,
} = require("../controllers/expenseController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/summary/monthly", getMonthlySummary);
router.get("/summary/weekly", getWeeklySummary);

module.exports = router;