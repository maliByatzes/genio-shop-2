import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import * as argon2 from "argon2";

export const registerHandler = async (req, res) => {
  try {
    const { email, phoneNumber, password, confirmPassword } = req.body;

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    if (!regex.test(email)) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });

    if (existingPhoneNumber) {
      res.status(400).json({ error: "Phone number already exists" });
      return;
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

export const loginHandler = (req, res) => {

};

export const logoutHandler = (req, res) => {

};
