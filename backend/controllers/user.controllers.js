import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import * as argon2 from "argon2";

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error in get user: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, phoneNumber, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
      return res.status(400).json({ error: "Please provide both current and new password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await argon2.verify(user.password, currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
    }

    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    user = await user.save();

    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error in update user: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
