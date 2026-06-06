const express = require("express");
const { getLatestExchangeRate } = require("../controllers/currencyController");

const router = express.Router();

router.get("/latest", getLatestExchangeRate);

module.exports = router;