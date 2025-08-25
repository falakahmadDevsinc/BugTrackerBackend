import express from "express";
import { authorize } from "../middleware/authenticate.js";
import { getProfile } from "../handler/authHandler.js";
import { ROLES } from "../utils/constants.js";
const SecureRoute = express.Router();
SecureRoute.get(
  "/profile",
  authorize([ROLES.DEVELOPER, ROLES.MANAGER, ROLES.QA]),
  getProfile
);

export default SecureRoute;
