import BugModel from "../model/BugModel.js";
import ProjectModel from "../model/ProjectModel.js";
import UserModel from "../model/UserModel.js";
import { BUG_STATUS, BUG_TYPES, BUGERRORS } from "../utils/constants.js";
import {
  notifyProjectUsersNewBug,
  notifyProjectUsersStatusChange,
} from "./notificationService.js";

const validateBugStatus = (type, status) => {
  if (!BUG_TYPES.includes(type)) throw new Error(BUGERRORS.BUG_TYPE_INVALID);

  if (type === "feature" && !BUG_STATUS.FEATURE.includes(status))
    throw new Error(BUGERRORS.BUG_STATUS_INVALID_FEATURE);

  if (type === "bug" && !BUG_STATUS.BUG.includes(status))
    throw new Error(BUGERRORS.BUG_STATUS_INVALID_BUG);
};

export const createBugService = async (
  userId,
  { title, description, screenshot, type, deadline, projectId, priority }
) => {
  if (!title || !type) throw new Error(BUGERRORS.BUG_REQUIRED_FIELDS);

  const project = await ProjectModel.findOne({
    _id: projectId,
    deletedAt: null,
  });
  if (!project) throw new Error(BUGERRORS.BUG_PROJECT_NOT_FOUND);

  const existingBug = await BugModel.findOne({ title, project: projectId });
  if (existingBug) throw new Error(BUGERRORS.BUG_TITLE_DUPLICATE);

  if (deadline && new Date(deadline) < new Date()) {
    throw new Error(BUGERRORS.BUG_DEADLINE_INVALID);
  }

  const bug = await BugModel.create({
    title,
    description,
    screenshot: screenshot || null,
    type,
    status: "new",
    priority: priority || "medium",
    deadline,
    creator: userId,
    project: projectId,
  });
  await notifyProjectUsersNewBug({ bug, project });

  return bug;
};

export const getProjectBugsService = async (projectId) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    deletedAt: null,
  });
  if (!project) throw new Error(BUGERRORS.BUG_PROJECT_NOT_FOUND);

  const bugs = await BugModel.find({ project: projectId })
    .populate("creator", "fullName email role")
    .populate("developer", "fullName email role")
    .populate("project", "name");

  return bugs;
};

export const getDeveloperBugsService = async (developerId, projectId) => {
  return await BugModel.find({
    developer: new mongoose.Types.ObjectId(developerId),
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate("creator", "fullName email role")
    .populate("developer", "fullName email role")
    .populate("project", "name description");
};

export const assignBugService = async (bugId, developerId, userRole) => {
  const bug = await BugModel.findById(bugId);
  if (!bug) throw new Error(BUGERRORS.BUG_NOT_FOUND);
  // Prevent reassignment if already assigned
  if (bug.developer) throw new Error("This bug is already assigned.");
  const project = await ProjectModel.findById(bug.project).populate("members");
  if (!project) throw new Error(BUGERRORS.BUG_PROJECT_NOT_FOUND);
  // Make sure the assigned person is in the project members
  const developer = project.members.find(
    (m) => m._id.toString() === developerId
  );
  if (!developer) throw new Error(BUGERRORS.DEVELOPER_NOT_IN_PROJECT);
  bug.developer = developer._id;
  await bug.save();
  await bug.populate("developer", "fullName email role");
  return bug;
};

export const updateBugStatusService = async (bugId, userId, status) => {
  const allowedStatuses = [...BUG_STATUS.FEATURE, ...BUG_STATUS.BUG];
  if (!allowedStatuses.includes(status.toLowerCase())) {
    throw new Error(BUGERRORS.BUG_STATUS_INVALID);
  }
  const bug = await BugModel.findById(bugId);
  if (!bug) throw new Error(BUGERRORS.BUG_NOT_FOUND);
  // Only the assigned person can update status
  if (!bug.developer || bug.developer.toString() !== userId.toString()) {
    throw new Error(BUGERRORS.BUG_NOT_ASSIGNED);
  }
  bug.status = status;
  await bug.save();
  // Get the project and user for notification
  const project = await ProjectModel.findById(bug.project).populate("members");
  const user = await UserModel.findById(userId); // get user fullName, etc.
  if (project && user) {
    await notifyProjectUsersStatusChange({ bug, project, user });
  }
  return bug;
};

export const getBugsCreatedByUserService = async (userId) => {
  const bugs = await BugModel.find({ creator: userId })
    .populate("creator", "fullName email role")
    .populate("developer", "fullName email role")
    .populate("project", "name description");

  return bugs;
};
export const getAssignedBugsService = async (userId) => {
  const bugs = await BugModel.find({ developer: userId })
    .populate("creator", "fullName email role")
    .populate("developer", "fullName email role")
    .populate("project", "name description");

  return bugs;
};
