import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";

async function sendTokenResponse(user, res, message) {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(201).json({
    success: true,
    token,
    message,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  const { email, password, contact, fullname, isSeller } = req.body;
  try {
    const isUserExist = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "An account with this email or contact already exists.",
      });
    }
    const user = await userModel.create({
      email,
      password,
      contact,
      fullname,
      role: isSeller ? "seller" : "user",
    });
    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.error(`Registration error: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The user with such email do not exist ",
        success: false,
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password do not match",
        success: false,
      });
    }
    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    console.error(`Registration error: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const googleCallback = async (req, res) => {
  console.log("=== Google Auth User Data ===");
  console.log(JSON.stringify(req.user, null, 2));
  console.log("==============================");
  res.redirect("http://localhost:5173/");
};