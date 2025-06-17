import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  console.log("Registration attempt with:", { email, name }); // Log registration attempt

  try {
    // Validate input
    if (!email || !password || !name) {
      console.log("Missing fields:", {
        email: !!email,
        password: !!password,
        name: !!name,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      email,
      password,
      name,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();
    console.log("User saved successfully:", user.email);

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        console.error("JWT Error:", err);
        return res.status(500).json({ message: "Error generating token" });
      }
      console.log("Token generated successfully for user:", user.email);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    });
  } catch (err) {
    console.error("Registration Error:", err);
    // Check for specific MongoDB errors
    if (err.name === "MongoError" && err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({
      message: "Server error during registration",
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

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      console.log(token);
      res.json({ token });
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
