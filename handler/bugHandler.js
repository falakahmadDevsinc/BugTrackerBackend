import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignBugService,
  createBugService,
  getAssignedBugsService,
  getBugsCreatedByUserService,
  getDeveloperBugsService,
  getProjectBugsService,
  updateBugStatusService,
} from "../services/bugService.js";
import { MESSAGES } from "../utils/responseMessages.js";

export const createBug = asyncHandler(async (req, res) => {
  const bug = await createBugService(req.user._id, {
    ...req.body,
    screenshot: req.file ? req.file.path : null,
    projectId: req.params.projectId,
  });
  res.status(201).json({ message: MESSAGES.BUG_CREATED, bug });
});

export const getProjectBugs = asyncHandler(async (req, res) => {
  const bugs = await getProjectBugsService(req.params.projectId);
  res.json({ message: MESSAGES.BUGS_FETCHED, bugs });
});

export const getDeveloperBugs = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const developerId = req.user._id;
  const bugs = await getDeveloperBugsService(developerId, projectId);
  res.json({ message: MESSAGES.BUGS_FETCHED, bugs });
});

export const assignBug = asyncHandler(async (req, res) => {
  const { bugId, developerId } = req.body;
  const bug = await assignBugService(bugId, developerId, req.user.role);
  res.status(200).json({ message: MESSAGES.BUG_ASSIGNED, bug });
});

export const updateBugStatus = asyncHandler(async (req, res) => {
  const bug = await updateBugStatusService(
    req.params.id,
    req.user._id,
    req.body.status
  );
  res.status(200).json({ message: MESSAGES.BUG_STATUS_UPDATED, bug });
});

export const getBugsCreatedByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const bugs = await getBugsCreatedByUserService(userId);
  res.json({ message: MESSAGES.BUGS_FETCHED, bugs });
});

export const getAssignedBugs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const bugs = await getAssignedBugsService(userId);
  res.json({ message: MESSAGES.BUGS_FETCHED, bugs });
});
