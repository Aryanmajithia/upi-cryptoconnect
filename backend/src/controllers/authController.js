import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
  const { JWT_SECRET } = process.env;

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

    const token = await signToken(payload, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
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
  const { JWT_SECRET } = process.env;

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

    const token = await signToken(payload, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
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

export const fetchUserDetails = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
