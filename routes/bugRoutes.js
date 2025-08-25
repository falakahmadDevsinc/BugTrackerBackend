import express from "express";
import {
  assignBug,
  createBug,
  getAssignedBugs,
  getBugsCreatedByUser,
  getDeveloperBugs,
  getProjectBugs,
  updateBugStatus,
} from "../handler/bugHandler.js";
import { upload } from "../middleware/uploadBugs.js";
import { ROLES } from "../utils/constants.js";
import { authorize } from "../middleware/authenticate.js";

const BugRouter = express.Router();

// QA can report bugs
BugRouter.post(
  "/projects/:projectId/bugs",
  authorize([ROLES.QA, ROLES.MANAGER]),
  upload.single("screenshot"), // <-- now uses Cloudinary
  createBug
);

// Everyone can view bugs in a project
BugRouter.get(
  "/projects/:projectId/bugs",
  authorize([ROLES.MANAGER, ROLES.QA, ROLES.DEVELOPER]),
  getProjectBugs
);

BugRouter.get(
  "/project/:projectId/bugs",
  authorize([ROLES.DEVELOPER]),
  getDeveloperBugs
);
BugRouter.post(
  "/bugs/assign",
  authorize([ROLES.QA, ROLES.MANAGER, ROLES.DEVELOPER]),
  assignBug
);
BugRouter.put(
  "/:id/status",
  authorize([ROLES.DEVELOPER, ROLES.QA, ROLES.MANAGER]),
  updateBugStatus
);
// QA & Manager: get bugs they created
BugRouter.get(
  "/my-bugs",
  authorize([ROLES.QA, ROLES.MANAGER]),
  getBugsCreatedByUser
);
// Any logged-in user can fetch bugs assigned to them
BugRouter.get(
  "/my-assigned-bugs",
  authorize([ROLES.MANAGER, ROLES.QA, ROLES.DEVELOPER]),
  getAssignedBugs
);

export default BugRouter;
