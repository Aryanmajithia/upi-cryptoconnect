import MoneyTransfer from "../models/MoneyTransfer.js";
import User from "../models/User.js";
import BankDetails from "../models/bank.js";
import requestMoney from "../models/requestMoney.js";

// Create money transfer
export const createMoneyTransfer = async (req, res) => {
  const { senderUPI, receiverUPI, amount, savePercent = 0 } = req.body;

  try {
    // Find sender's bank details
    const senderBankDetails = await BankDetails.findOne({ upiId: senderUPI });
    if (!senderBankDetails) {
      return res.status(404).json({ message: "Sender bank details not found" });
    }

    // Find receiver's bank details
    const receiverBankDetails = await BankDetails.findOne({
      upiId: receiverUPI,
    });
    if (!receiverBankDetails) {
      return res
        .status(404)
        .json({ message: "Receiver bank details not found" });
    }

    // Calculate saved amount and transfer amount
    const savedAmount = (amount * savePercent) / 100;
    const transferAmount = amount - savedAmount;

    // Check if sender has sufficient funds
    if (senderBankDetails.amount < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Update sender's and receiver's balances and savings
    senderBankDetails.amount -= amount;
    receiverBankDetails.amount += transferAmount;
    senderBankDetails.savings = (senderBankDetails.savings || 0) + savedAmount;

    // Save money transfer details
    const moneyTransfer = new MoneyTransfer({
      sender: senderBankDetails.user,
      senderUPI,
      receiver: receiverBankDetails.user,
      receiverUPI,
      amount: transferAmount,
      savedAmount,
      savePercent,
    });

    await moneyTransfer.save();
    await senderBankDetails.save();
    await receiverBankDetails.save();

    // Respond with success message and transfer details
    res.json({
      message: "Money transfer successful",
      senderUPI,
      receiverUPI,
      transferAmount,
      savedAmount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get money transfers for current user
export const getMoneyTransfers = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all money transfers involving the current user as either sender or receiver
    const transfers = await MoneyTransfer.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver"); // Populate sender and receiver details for more information
    res.json(transfers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const RequestMoney = async (req, res, next) => {
  try {
    const { name, email, amount, token, message } = req.body;
    const userId = req.user.id;

    // Find the user making the request
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Find or create the requestMoney record for the current user
    let userRequestMoney = await requestMoney.findOne({ user: userId });
    if (!userRequestMoney) {
      userRequestMoney = new requestMoney({
        user: userId,
        upi: user.email,
        metamask: user.email,
        requests: [],
      });
      await userRequestMoney.save();
    }

    // Add the new request to the user's requests
    userRequestMoney.requests.push({
      amount: amount.toString(),
      sender: email || name,
      name: name || email,
    });

    await userRequestMoney.save();

    res.status(200).json({
      success: true,
      message: "Request sent successfully.",
    });
  } catch (error) {
    console.error("RequestMoney error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const allRequestMoney = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let money = await requestMoney.findOne({ user: userId });

    if (!money) {
      // Create a new requestMoney record for the user if it doesn't exist
      money = new requestMoney({
        user: userId,
        upi: req.user.email, // Use email as UPI for now
        metamask: req.user.email, // Use email as metamask for now
        requests: [],
      });
      await money.save();
    }

    return res.status(200).json({
      message: "found",
      money: {
        requests: money.requests || [],
      },
    });
  } catch (error) {
    console.error("allRequestMoney error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const allrequest = async (req, res, next) => {
  try {
    const rr = await requestMoney.find({});

    res.status(200).json({ rr });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
