import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getUserNotificationsService,
  markNotificationReadService,
} from "../services/notificationService.js";

export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await getUserNotificationsService(req.user._id);
  res.json({ notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationReadService(
    req.params.id,
    req.user._id
  );
  res.json({ notification });
});
