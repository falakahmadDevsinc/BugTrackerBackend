import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import SecureRoute from "./routes/secureRoutes.js";
import ProjectRouter from "./routes/projectRoutes.js";
import "./Auth/Auth.js";
import { connectDB } from "./Db/connection.js";
import config from "./utils/config/config.js";
import errorHandler from "./middleware/errorHandler.js";
import BugRouter from "./routes/bugRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import authRouter from "./routes/authRoutes.js";
import NotificationRouter from "./routes/notificationRoutes.js";
import AIResponsesRouter from "./routes/aiRoutes.js";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS for API
app.use(cors({ origin: config.clientOrigin }));

// Serve uploads with CORS
app.use(
  "/uploads",
  cors({ origin: config.clientOrigin }),
  express.static(path.join(__dirname, "uploads"))
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/", ProjectRouter);
app.use("/api/v1/", BugRouter);
app.use("/api/v1/", NotificationRouter);
app.use("/api/v1/", AIResponsesRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), SecureRoute);

connectDB();
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

export default app;
