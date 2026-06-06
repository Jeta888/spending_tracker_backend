const getLatestExchangeRate = async (req, res) => {
  try {
    const { from = "EUR", to = "USD" } = req.query;

    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch exchange rate",
      });
    }

    const data = await response.json();

    return res.json({
      base: data.base,
      date: data.date,
      rates: data.rates,
    });
  } catch (error) {
    console.error("Currency API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getLatestExchangeRate,
};