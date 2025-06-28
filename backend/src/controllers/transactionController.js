import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
  try {
    const { amount, currency, category, description, transactionType } =
      req.body;

    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      currency,
      category,
      description,
      transactionType,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getIncome = async (req, res) => {
  const { month } = req.params;
  const startDate = new Date(month);
  const endDate = new Date(month);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const income = await Transaction.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user.id),
          transactionType: "credit",
          timestamp: { $gte: startDate, $lt: endDate },
        },
      },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    res.status(200).json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  try {
    // Find the transaction by ID and ensure it belongs to the current user
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.user.id, // Assuming req.user.id is available from authentication middleware
    });

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getFilteredTransactions = async (req, res) => {
  try {
    const { type, dateRange, amountRange } = req.body;
    const userId = req.user.id;

    let query = { user: userId };

    // Apply type filter
    if (type && type !== "all") {
      query.type = type;
    }

    // Apply date range filter
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      query.createdAt = { $gte: startDate };
    }

    // Apply amount range filter
    if (amountRange && amountRange !== "all") {
      switch (amountRange) {
        case "small":
          query.amount = { $lt: 1000 };
          break;
        case "medium":
          query.amount = { $gte: 1000, $lt: 5000 };
          break;
        case "large":
          query.amount = { $gte: 5000 };
          break;
      }
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getTransactionsByUser = async (req, res) => {
  try {
    const { email } = req.params;

    // For now, return empty array since we don't have email-based transactions
    // In a real implementation, you would query by user email
    // This prevents the 404 error and allows the frontend to continue working
    res.status(200).json([]);
  } catch (err) {
    console.error("getTransactionsByUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
