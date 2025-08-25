import jwt from "jsonwebtoken";
import config from "../utils/config/config.js";
import UserModel from "../model/UserModel.js";
import OTPModel from "../model/OTPModel.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "./emailService.js";

export const generateToken = (user) => {
  const payload = {
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "1d",
    issuer: "bug-tracker-api",
    audience: "bug-tracker-client",
  });
};

// Send OTP for registration
export const handleSendOTP = async ({ email, fullName, password, role }) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTPModel.findOneAndUpdate(
    { email },
    { otp, expiresAt, fullName, password, role },
    { upsert: true, new: true }
  );

  await sendOTPEmail(email, otp);
  return { message: "OTP sent successfully" };
};

// Verify OTP & create user
export const handleVerifyOTP = async ({ email, otp }) => {
  const record = await OTPModel.findOne({ email, otp });
  if (!record || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  const newUser = await UserModel.create({
    fullName: record.fullName,
    email: record.email,
    password: record.password, // hashed via pre-save hook
    role: record.role,
  });

  await OTPModel.deleteOne({ _id: record._id });
  return newUser;
};

export const generateOtpService = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
  await OTPModel.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
  await sendOTPEmail(email, otp);
  return { success: true, message: "OTP sent to your email" };
};

export const verifyOtpService = async (email, otp) => {
  const record = await OTPModel.findOne({ email, otp });
  if (!record) throw new Error("Invalid OTP");
  if (record.expiresAt < Date.now()) throw new Error("OTP expired");
  return { success: true, message: "OTP verified" };
};

export const resetPasswordService = async (email, newPassword) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User not found");
  user.password = newPassword;
  await user.save();
  return { success: true, message: "Password reset successful" };
};
