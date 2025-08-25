import express from "express";
import { authorize } from "../middleware/authenticate.js";
import { ROLES } from "../utils/constants.js";
import {
  getUserNotifications,
  markNotificationRead,
} from "../handler/notificationHandler.js";

const NotificationRouter = express.Router();

NotificationRouter.get(
  "/notifications",
  authorize([ROLES.MANAGER, ROLES.QA, ROLES.DEVELOPER]),
  getUserNotifications
);

NotificationRouter.put(
  "/notifications/:id/read",
  authorize([ROLES.MANAGER, ROLES.QA, ROLES.DEVELOPER]),
  markNotificationRead
);

export default NotificationRouter;
