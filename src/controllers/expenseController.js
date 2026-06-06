const pool = require("../config/db");

const createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category, expense_date } = req.body;

    if (!title || !amount || !category || !expense_date) {
      return res.status(400).json({
        message: "Title, amount, category and expense date are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses 
       (user_id, title, amount, category, expense_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, amount, category, expense_date],
    );

    return res.status(201).json({
      message: "Expense created successfully",
      expenseId: result.insertId,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const { category, startDate, endDate } = req.query;

    let query = "SELECT * FROM expenses WHERE user_id = ?";
    const queryParams = [userId];

    if (category) {
      query += " AND category = ?";
      queryParams.push(category);
    }

    if (startDate) {
      query += " AND expense_date >= ?";
      queryParams.push(startDate);
    }

    if (endDate) {
      query += " AND expense_date <= ?";
      queryParams.push(endDate);
    }

    query += " ORDER BY expense_date DESC";

    const [expenses] = await pool.query(query, queryParams);

    return res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const [expenses] = await pool.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [expenseId, userId],
    );

    if (expenses.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.json(expenses[0]);
  } catch (error) {
    console.error("Get expense by ID error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const { title, amount, category, expense_date } = req.body;

    if (!title || !amount || !category || !expense_date) {
      return res.status(400).json({
        message: "Title, amount, category and expense date are required",
      });
    }

    const [existingExpense] = await pool.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [expenseId, userId],
    );

    if (existingExpense.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await pool.query(
      `UPDATE expenses
       SET title = ?, amount = ?, category = ?, expense_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, amount, category, expense_date, expenseId, userId],
    );

    return res.json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Update expense error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const [existingExpense] = await pool.query(
      "SELECT * FROM expenses WHERE id = ? AND user_id = ?",
      [expenseId, userId],
    );

    if (existingExpense.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await pool.query("DELETE FROM expenses WHERE id = ? AND user_id = ?", [
      expenseId,
      userId,
    ]);

    return res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [summary] = await pool.query(
      `SELECT 
          DATE_FORMAT(expense_date, '%Y-%m') AS month,
          SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
       GROUP BY month
       ORDER BY month DESC`,
      [userId],
    );

    return res.json(summary);
  } catch (error) {
    console.error("Monthly summary error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [summary] = await pool.query(
      `SELECT 
          YEARWEEK(expense_date, 1) AS week,
          SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
       GROUP BY week
       ORDER BY week DESC`,
      [userId],
    );

    return res.json(summary);
  } catch (error) {
    console.error("Weekly summary error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getWeeklySummary,
  getExpenseById,
};
