import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
async function sendTokenResponse(user, res,message) {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in enviromnet varables");
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.cookie("token",token)
  res.status(200).json({
    success:true,
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
  const { email, password, contact, fullname } = req.body;
  try {
    const isUserExist = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "This user already exist",
      });
    }
    const user = await userModel.create({
      email,
      password,
      contact,
      fullname,
    });
    await sendTokenResponse(user,res,"User registered successfully");
  } catch (error) {
    console.log(`some error has occured ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};
