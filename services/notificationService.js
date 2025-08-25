import NotificationModel from "../model/NotificationModel.js";

export const notifyProjectUsersNewBug = async ({ bug, project }) => {
  if (!project.members || project.members.length === 0) return;

  const recipients = project.members
    .filter((m) => m._id.toString() !== bug.creator.toString())
    .map((member) => ({ userId: member._id, isRead: false }));

  if (recipients.length > 0) {
    await NotificationModel.create({
      project: project._id,
      bug: bug._id,
      recipients,
      message: `A new ${bug.type} "${bug.title}" was created in project "${project.name}"`,
    });
  }
};

export const getUserNotificationsService = async (userId) => {
  return await NotificationModel.find({ "recipients.userId": userId })
    .populate("bug", "title status type")
    .populate("project", "name");
};

export const markNotificationReadService = async (notifId, userId) => {
  return await NotificationModel.findOneAndUpdate(
    { _id: notifId, "recipients.userId": userId },
    { $set: { "recipients.$.isRead": true } }, // update only this user's entry
    { new: true }
  );
};

export const notifyProjectUsersStatusChange = async ({
  bug,
  project,
  user,
}) => {
  if (!project.members || project.members.length === 0) return;
  const recipients = project.members
    .filter(
      (m) => m?._id && user?._id && m._id.toString() !== user._id.toString()
    )
    .map((member) => ({ userId: member._id, isRead: false }));

  if (recipients.length > 0) {
    await NotificationModel.create({
      project: project._id,
      bug: bug._id,
      recipients,
      message: `User "${user.fullName}" updated the status of bug "${bug.title}" in project "${project.name}" to "${bug.status}"`,
    });
  }
};
