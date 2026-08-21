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
  try {
    const { id, displayName, emails } = req.user;
    const email = emails && emails[0] ? emails[0].value : "";
    const fullname = displayName || "User";
    const googleId = id;

    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        email,
        fullname,
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendBase =
      config.NODE_ENV === "development" ? "http://localhost:5173" : "";

    if (!user.contact) {
      return res.redirect(`${frontendBase}/contact`);
    }

    return res.redirect(`${frontendBase}/`);
  } catch (error) {
    console.error(`Google auth callback error: ${error}`);
    const frontendBase =
      config.NODE_ENV === "development" ? "http://localhost:5173" : "";
    return res.redirect(`${frontendBase}/login?error=google_auth_failed`);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`getMe error: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Server error retrieving profile." });
  }
};

export const updateContact = async (req, res) => {
  const { contact } = req.body;
  try {
    const existingUser = await userModel.findOne({
      contact,
      _id: { $ne: req.user._id },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this contact number already exists.",
      });
    }

    req.user.contact = contact;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Contact details updated successfully.",
      user: {
        id: req.user._id,
        email: req.user.email,
        contact: req.user.contact,
        fullname: req.user.fullname,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error(`updateContact error: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};