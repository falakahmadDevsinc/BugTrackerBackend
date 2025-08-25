import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProjectService,
  getAllProjectsService,
  editProjectService,
  deleteProjectService,
  getAvailableMembersService,
  addMemberToProjectService,
  removeMemberFromProjectService,
  getQAProjectsService,
  getDeveloperProjectsService,
  getProjectUsersService,
} from "../services/projectService.js";
import { MESSAGES } from "../utils/responseMessages.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.user._id, req.body);
  res.status(201).json({ message: MESSAGES.PROJECT_CREATED, project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await getAllProjectsService(req.user._id);
  res.json({ message: MESSAGES.PROJECT_FETCHED, projects });
});

export const editProject = asyncHandler(async (req, res) => {
  const project = await editProjectService(
    req.user._id,
    req.params.projectId,
    req.body
  );
  res.json({ message: MESSAGES.PROJECT_UPDATED, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await deleteProjectService(
    req.user._id,
    req.params.projectId
  );
  res.json({ message: MESSAGES.PROJECT_DELETED, project });
});

export const getAvailableMembers = asyncHandler(async (req, res) => {
  const members = await getAvailableMembersService();
  res.json({ members });
});

export const addMemberToProject = asyncHandler(async (req, res) => {
  const updatedProject = await addMemberToProjectService(
    req.user._id,
    req.params.id,
    req.body.memberId
  );
  res.json({ message: MESSAGES.MEMBER_ADDED, project: updatedProject });
});

export const removeMemberFromProject = asyncHandler(async (req, res) => {
  const updatedProject = await removeMemberFromProjectService(
    req.user._id,
    req.params.id,
    req.body.memberId
  );
  res.json({ message: MESSAGES.MEMBER_REMOVED, project: updatedProject });
});

// QA Related Handlers:
export const getQAProjects = asyncHandler(async (req, res) => {
  const projects = await getQAProjectsService(req.user._id);
  res.json({ message: MESSAGES.PROJECT_FETCHED, projects });
});
// Developers Related Handlers:
export const getDeveloperProjects = asyncHandler(async (req, res) => {
  const projects = await getDeveloperProjectsService(req.user._id);
  res.json({ message: MESSAGES.PROJECT_FETCHED, projects });
});

export const getProjectUsers = asyncHandler(async (req, res) => {
  const users = await getProjectUsersService(req.params.projectId);
  res.json({ users });
});
