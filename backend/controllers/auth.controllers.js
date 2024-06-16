import User from "../models/user.model.js";
import { generateToken } from "../utils/generateTokens.js";
import logger from "../utils/logger.js";
import * as argon2 from "argon2";

export const registerHandler = async (req, res) => {
  try {
    const { email, phoneNumber, password, confirmPassword } = req.body;

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    if (!regex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingPhoneNumber) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      email,
      phoneNumber,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    logger.error(`Error in register handler: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isMatch = await argon2.verify(user.password, password);

    if (!user || !isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    await generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    logger.error(`Error in login handler: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutHandler = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    logger.error(`Error in logout handler: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerAdminHandler = async (req, res) => {
  try {
    const { email, phoneNumber, password, confirmPassword } = req.body;

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    if (!regex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingPhoneNumber) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    const hashedPassword = await argon2.hash(password);

    const newAdmin = new User({
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    });

    if (newAdmin) {
      await newAdmin.save();

      return res.status(201).json({
        _id: newAdmin._id,
        email: newAdmin.email,
        phoneNumber: newAdmin.phoneNumber,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    logger.error(`Error in register admin handler: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
