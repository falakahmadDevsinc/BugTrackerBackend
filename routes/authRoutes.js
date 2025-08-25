import { Router } from "express";
import { loginLimiter } from "../middleware/rateLimiter.js";
import {
  ForgetPasswordhandler,
  ResetPassword,
  sendOTP,
  SubmitContact,
  UserLogin,
  verifyOTP,
  VerifyResetOtp,
} from "../handler/authHandler.js";
const authRouter = new Router();

// Send OTP to email
authRouter.post("/send", sendOTP);

// Verify OTP
authRouter.post("/verify", verifyOTP);
// POST /auth/forgot-password
authRouter.post("/forgot-password", ForgetPasswordhandler);
// POST /auth/verify-reset-otp
authRouter.post("/verify-reset-otp", VerifyResetOtp);
// POST /auth/reset-password
authRouter.post("/reset-password", ResetPassword);

authRouter.post("/login", loginLimiter, UserLogin);

authRouter.post("/contactSubmit", SubmitContact);

export default authRouter;
