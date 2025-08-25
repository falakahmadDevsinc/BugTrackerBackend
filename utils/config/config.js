import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoURL: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "TOP_SECRET",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  emailService: process.env.EMAIL_SERVICE || "gmail",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  aiApiKey:
    process.env.GEMINI_API_KEY || "AIzaSyCEM-I33SCA5wdj-sYaIa6UGEQG62h1_sc",
};
