import BankDetails from "../models/bank.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import requestMoney from "../models/requestMoney.js";

const generateUpiId = () => {
  return `upi${crypto.randomBytes(6).toString("hex")}`;
};

export const linking = async (req, res) => {
  try {
    const { upi, metamask } = req.body;
    const userId = req.user.id;
    console.log(userId);
    if (!upi || !metamask) {
      return res
        .status(400)
        .json({ message: "UPI and Metamask IDs are required" });
    }

    const r = await requestMoney.create({
      user: userId,
      upi: upi,
      metamask: metamask,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          upiId: upi,
          metamaskId: metamask,
          requests: r._id,
        },
        kyc: true,
      },
      { new: true }
    );

    await updatedUser.save();
    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: "Failed to update user", updatedUser });
    }

    return res
      .status(200)
      .json({ message: "Links updated successfully", user: updatedUser });
  } catch (error) {
    const { bid } = req.body;
    await BankDetails.deleteOne({ _id: bid });
    return res.status(500).json({ message: "Server updating error: " + error });
  }
};

export const addBankDetails = async (req, res) => {
  const {
    bankName,
    ifscCode,
    accountHolder,
    accountAddress,
    accountType,
    amount,
  } = req.body;
  const userId = req.user.id;

  try {
    let bankDetails = await BankDetails.findOne({ user: userId });
    if (bankDetails) {
      return res
        .status(400)
        .json({ message: "Bank details already exist for this user" });
    }

    const upiId = generateUpiId();

    bankDetails = new BankDetails({
      user: userId,
      bankName,
      ifscCode,
      accountHolder,
      accountAddress,
      accountType,
      amount,
      upiId,
    });

    const bd = await bankDetails.save();
    console.log(bd);

    return res
      .status(201)
      .json({ message: "Bank details added successfully", upiId, id: bd._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const usersWithBankAccounts = await BankDetails.find().distinct("user");

    const users = await User.find({
      _id: { $in: usersWithBankAccounts },
    }).select("name");
    const bankDetails = await BankDetails.find({
      user: { $in: usersWithBankAccounts },
    });
    const usersWithDetails = users.map((user) => {
      const userBankDetails = bankDetails.find(
        (detail) => detail.user.toString() === user._id.toString()
      );
      const userDetails = {
        _id: user._id,
        name: user.name,
        bankDetails: userBankDetails
          ? {
              accountNumber: userBankDetails.accountNumber,
              bankName: userBankDetails.bankName,
              branchName: userBankDetails.branchName,
              ifscCode: userBankDetails.ifscCode,
              upiId: userBankDetails.upiId,
              balance: userBankDetails.amount,
              createdAt: userBankDetails.createdAt,
              updatedAt: userBankDetails.updatedAt,
            }
          : null,
      };

      return userDetails;
    });

    res.json(usersWithDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getLoggedUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWithBankAccount = await BankDetails.findOne({ user: userId });

    if (!userWithBankAccount) {
      return res
        .status(404)
        .json({ msg: "No bank details found for this user" });
    }

    const user = await User.findById(userId).select("name");
    const userDetails = {
      _id: user._id,
      name: user.name,
      bankDetails: {
        bankName: userWithBankAccount.bankName,
        ifscCode: userWithBankAccount.ifscCode,
        upiId: userWithBankAccount.upiId,
        balance: userWithBankAccount.amount,
        createdAt: userWithBankAccount.createdAt,
        updatedAt: userWithBankAccount.updatedAt,
      },
    };

    res.json(userDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const sendUPITransaction = async (req, res) => {
  try {
    const { amount, recipientUPI, note } = req.body;
    const userId = req.user.id;

    if (!amount || !recipientUPI) {
      return res
        .status(400)
        .json({ message: "Amount and recipient UPI ID are required" });
    }

    // Check if user has sufficient balance
    const userBankDetails = await BankDetails.findOne({ user: userId });
    if (!userBankDetails || userBankDetails.amount < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Check if recipient exists
    const recipientBankDetails = await BankDetails.findOne({
      upiId: recipientUPI,
    });
    if (!recipientBankDetails) {
      return res.status(400).json({ message: "Recipient UPI ID not found" });
    }

    // Deduct amount from sender
    userBankDetails.amount -= parseFloat(amount);
    await userBankDetails.save();

    // Add amount to recipient
    recipientBankDetails.amount += parseFloat(amount);
    await recipientBankDetails.save();

    // Create transaction record (you might want to create a separate Transaction model)
    const transaction = {
      sender: userId,
      recipient: recipientBankDetails.user,
      amount: parseFloat(amount),
      type: "SENT",
      upiId: recipientUPI,
      note: note || "",
      status: "SUCCESS",
      date: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: "UPI transaction successful",
      transaction,
    });
  } catch (error) {
    console.error("UPI transaction error:", error);
    return res
      .status(500)
      .json({ message: "Server error during UPI transaction" });
  }
};

export const receiveUPITransaction = async (req, res) => {
  try {
    const { amount, senderUPI, note } = req.body;
    const userId = req.user.id;

    if (!amount || !senderUPI) {
      return res
        .status(400)
        .json({ message: "Amount and sender UPI ID are required" });
    }

    // Check if sender exists
    const senderBankDetails = await BankDetails.findOne({ upiId: senderUPI });
    if (!senderBankDetails) {
      return res.status(400).json({ message: "Sender UPI ID not found" });
    }

    // Check if sender has sufficient balance
    if (senderBankDetails.amount < amount) {
      return res
        .status(400)
        .json({ message: "Sender has insufficient balance" });
    }

    // Get recipient bank details
    const recipientBankDetails = await BankDetails.findOne({ user: userId });
    if (!recipientBankDetails) {
      return res
        .status(400)
        .json({ message: "Recipient bank details not found" });
    }

    // Deduct amount from sender
    senderBankDetails.amount -= parseFloat(amount);
    await senderBankDetails.save();

    // Add amount to recipient
    recipientBankDetails.amount += parseFloat(amount);
    await recipientBankDetails.save();

    // Create transaction record
    const transaction = {
      sender: senderBankDetails.user,
      recipient: userId,
      amount: parseFloat(amount),
      type: "RECEIVED",
      upiId: senderUPI,
      note: note || "",
      status: "SUCCESS",
      date: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: "UPI transaction received successfully",
      transaction,
    });
  } catch (error) {
    console.error("UPI receive error:", error);
    return res.status(500).json({ message: "Server error during UPI receive" });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // For now, return mock transaction data
    // In a real application, you would query a Transaction model
    const mockTransactions = [
      {
        id: 1,
        date: new Date(Date.now() - 86400000), // 1 day ago
        type: "SENT",
        upiId: "example@bank",
        amount: 1000,
        status: "SUCCESS",
      },
      {
        id: 2,
        date: new Date(Date.now() - 172800000), // 2 days ago
        type: "RECEIVED",
        upiId: "sender@bank",
        amount: 500,
        status: "SUCCESS",
      },
      {
        id: 3,
        date: new Date(Date.now() - 259200000), // 3 days ago
        type: "SENT",
        upiId: "friend@bank",
        amount: 200,
        status: "SUCCESS",
      },
    ];

    return res.status(200).json({
      success: true,
      transactions: mockTransactions,
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    return res
      .status(500)
      .json({ message: "Server error getting transaction history" });
  }
};
