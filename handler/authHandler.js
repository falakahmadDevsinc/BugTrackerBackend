import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateOtpService,
  generateToken,
  handleSendOTP,
  handleVerifyOTP,
  resetPasswordService,
  verifyOtpService,
} from "../services/authService.js";
import { createContact } from "../services/contactService.js";
import { MESSAGES } from "../utils/responseMessages.js";
import UserModel from "../model/UserModel.js";
import OTPModel from "../model/OTPModel.js";

// Send OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email, fullName, password, role } = req.body;
  const result = await handleSendOTP({ email, fullName, password, role });

  res.json({
    success: true,
    message: "OTP sent successfully",
    data: result, // keep all extra info inside data
  });
});

// Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const newUser = await handleVerifyOTP({ email, otp });

  res.json({
    success: true,
    message: "Registration successful",
    data: {
      user: newUser,
    },
  });
});

export const UserLogin = asyncHandler((req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({
        success: false,
        message: info?.message || MESSAGES.INVALID_CREDENTIALS,
      });

    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) return next(loginErr);

      const token = generateToken(user);

      return res.json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        token,
        role: user.role,
        data: { fullName: user.fullName, email: user.email },
      });
    });
  })(req, res, next);
});

// Forget Password (Send OTP)
export const ForgetPasswordhandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await generateOtpService(email);
  if (!result.success) {
    return res.status(404).json(result);
  }
  return res.status(200).json(result);
});

// Verify OTP
export const VerifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await verifyOtpService(email, otp);
  res.json(result);
});

// Reset Password
export const ResetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const result = await resetPasswordService(email, newPassword);
  res.json(result);
});

export const SubmitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.CONTACT_ALLFIELDS_REQ,
    });
  }

  const contact = await createContact({ name, email, message });
  res.status(200).json({
    success: true,
    message: MESSAGES.CONTACT_SUBMITTED,
    data: contact,
  });
});

export const getProfile = (req, res) => {
  res.json({
    success: true,
    message: MESSAGES.USER_PROFILE_FETCHED,
    data: {
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
