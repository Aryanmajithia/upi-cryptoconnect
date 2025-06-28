import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config.js";

// Utility to promisify jwt.sign
const signToken = (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ email, password, name });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: { id: user.id, email: user.email, name: user.name },
    };

    const token = await signToken(payload, jwtSecret, { expiresIn: "1d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        walletAddress: user.walletAddress,
        upiId: user.upiId,
        bankAccount: user.bankAccount,
        ifscCode: user.ifscCode,
        balance: user.balance,
        transactionCount: user.transactionCount,
        isWalletConnected: user.isWalletConnected,
        metamaskId: user.metamaskId,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      message: "Server error during registration.",
      error: err.message,
    });
  }
};

// user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await signToken(payload, jwtSecret, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        walletAddress: user.walletAddress,
        upiId: user.upiId,
        bankAccount: user.bankAccount,
        ifscCode: user.ifscCode,
        balance: user.balance,
        transactionCount: user.transactionCount,
        isWalletConnected: user.isWalletConnected,
        metamaskId: user.metamaskId,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// upis linkings
export const linking = async (req, res) => {
  try {
    const { email, upi, metamask } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          upiId: upi,
          metamaskId: metamask,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }
    return res
      .status(200)
      .json({ message: "Links updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: "server updating error." });
  }
};

// update use details
export const update = async (req, res) => {
  try {
    const { name, email, mob, age, dob, address, status } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const updateUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          mobile: mob,
          age,
          dob,
          address,
          status,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }
    return res
      .status(200)
      .json({ message: "updated successfully", user: updateUser });
  } catch (error) {
    return res.status(400).json({ message: "server updating error." });
  }
};

// get user details
export const details = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The token is already verified by the authMiddleware
    // We just need to return the user data
    const user = req.user;

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        walletAddress: user.walletAddress,
        upiId: user.upiId,
        bankAccount: user.bankAccount,
        ifscCode: user.ifscCode,
        balance: user.balance,
        transactionCount: user.transactionCount,
        isWalletConnected: user.isWalletConnected,
        metamaskId: user.metamaskId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      valid: false,
      message: "Invalid token",
    });
  }
};

export const fetchUserDetails = async (req, res) => {
  try {
    const { upi, email } = req.body;

    let user;
    if (upi) {
      // Find user by UPI ID
      user = await User.findOne({ upiId: upi }).select("-password");
    } else if (email) {
      // Find user by email
      user = await User.findOne({ email }).select("-password");
    } else {
      return res.status(400).json({ message: "UPI ID or email is required" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return complete user object for email queries, specific fields for UPI queries
    if (email) {
      res.status(200).json({ user });
    } else {
      res.status(200).json({
        metamaskId: user.metamaskId || user.walletAddress || user.email,
        upiId: user.upiId || user.email,
      });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile: Request received", {
      userId: req.user?.id,
      body: req.body,
      headers: req.headers,
    });

    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address,
      walletAddress,
      upiId,
      bankAccount,
      ifscCode,
    } = req.body;

    console.log("updateProfile: Processing update for user:", userId);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("updateProfile: User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("updateProfile: User found:", {
      userId: user._id,
      email: user.email,
    });

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (walletAddress) {
      updateData.walletAddress = walletAddress;
      updateData.isWalletConnected = true;
    }
    if (upiId) updateData.upiId = upiId;
    if (bankAccount) updateData.bankAccount = bankAccount;
    if (ifscCode) updateData.ifscCode = ifscCode;

    console.log("updateProfile: Update data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      console.log("updateProfile: Failed to update user");
      return res.status(500).json({ message: "Failed to update profile" });
    }

    console.log("updateProfile: User updated successfully:", {
      userId: updatedUser._id,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        walletAddress: updatedUser.walletAddress,
        upiId: updatedUser.upiId,
        bankAccount: updatedUser.bankAccount,
        ifscCode: updatedUser.ifscCode,
        balance: updatedUser.balance,
        transactionCount: updatedUser.transactionCount,
        isWalletConnected: updatedUser.isWalletConnected,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Server error during profile update",
      error: error.message,
    });
  }
};
