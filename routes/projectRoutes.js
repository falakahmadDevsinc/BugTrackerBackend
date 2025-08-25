import express from "express";
import {
  addMemberToProject,
  createProject,
  deleteProject,
  editProject,
  getAllProjects,
  getAvailableMembers,
  getDeveloperProjects,
  getProjectUsers,
  getQAProjects,
  removeMemberFromProject,
} from "../handler/projectHandler.js";
import { authorize } from "../middleware/authenticate.js";
import { ROLES } from "../utils/constants.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/projects", authorize([ROLES.MANAGER]), createProject);
ProjectRouter.get("/projects", authorize([ROLES.MANAGER]), getAllProjects);
ProjectRouter.put(
  "/projects/:projectId",
  authorize([ROLES.MANAGER]),
  editProject
);
ProjectRouter.delete(
  "/projects/:projectId",
  authorize([ROLES.MANAGER]),
  deleteProject
);
ProjectRouter.get(
  "/projects/available-members",
  authorize([ROLES.MANAGER]),
  getAvailableMembers
);
ProjectRouter.post(
  "/projects/:id/add-member",
  authorize([ROLES.MANAGER]),
  addMemberToProject
);

ProjectRouter.delete(
  "/projects/:id/remove-member",
  authorize([ROLES.MANAGER]),
  removeMemberFromProject
);

// Route for QA to get projects they are added to
ProjectRouter.get(
  "/qa-projects",
  authorize([ROLES.QA, ROLES.MANAGER]),
  getQAProjects
);
ProjectRouter.get(
  "/developer-projects",
  authorize([ROLES.DEVELOPER]),
  getDeveloperProjects
);
ProjectRouter.get(
  "/projects/:projectId/users",
  authorize([ROLES.MANAGER, ROLES.QA, ROLES.DEVELOPER]),
  getProjectUsers
);

export default ProjectRouter;
