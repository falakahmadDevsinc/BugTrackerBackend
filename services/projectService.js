import mongoose from "mongoose";
import ProjectModel from "../model/ProjectModel.js";
import UserModel from "../model/UserModel.js";
import { PROJECT_STATUS, PROJECTERRORS, ROLES } from "../utils/constants.js";
import {
  sendProjectAddedEmail,
  sendProjectRemovedEmail,
} from "./emailService.js";

export const createProjectService = async (
  userId,
  {
    name,
    description,
    members = [],
    status = PROJECT_STATUS[0],
    startDate,
    expectedEndDate,
  }
) => {
  if (!name) throw new Error(PROJECTERRORS.PROJECT_NAME_REQUIRED);
  if (!startDate) throw new Error(PROJECTERRORS.PROJECT_START_REQUIRED);
  if (!expectedEndDate) throw new Error(PROJECTERRORS.PROJECT_END_REQUIRED);

  const existing = await ProjectModel.findOne({ name, createdBy: userId });
  if (existing) throw new Error(PROJECTERRORS.PROJECT_NAME_DUPLICATE);

  const finalMembers = Array.from(new Set([userId.toString(), ...members]));

  const project = await ProjectModel.create({
    name,
    description,
    createdBy: userId,
    members: finalMembers,
    status,
    startDate,
    expectedEndDate,
  });

  return project;
};

export const getAllProjectsService = async (userId) => {
  const projects = await ProjectModel.find({
    createdBy: userId,
    deletedAt: null,
  })
    .populate("members", "fullName email")
    .populate("createdBy", "fullName email");

  return projects;
};

export const editProjectService = async (
  userId,
  projectId,
  { name, description, status, startDate, expectedEndDate }
) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new Error(PROJECTERRORS.PROJECT_NOT_FOUND);

  if (project.createdBy.toString() !== userId.toString())
    throw new Error(PROJECTERRORS.NOT_AUTHORIZED);

  if (name && name !== project.name) {
    const existing = await ProjectModel.findOne({ name });
    if (existing) throw new Error(PROJECTERRORS.PROJECT_NAME_DUPLICATE);
    project.name = name;
  }

  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (startDate) project.startDate = startDate;
  if (expectedEndDate) project.expectedEndDate = expectedEndDate;

  await project.save();
  return project;
};

export const deleteProjectService = async (userId, projectId) => {
  const project = await ProjectModel.findById(projectId);
  if (!project || project.deletedAt)
    throw new Error(PROJECTERRORS.PROJECT_NOT_FOUND);

  if (project.createdBy.toString() !== userId.toString())
    throw new Error(PROJECTERRORS.NOT_AUTHORIZED);

  project.deletedAt = new Date();
  await project.save();
  return project;
};

export const getAvailableMembersService = async () => {
  const members = await UserModel.find(
    {
      role: { $in: [ROLES.DEVELOPER, ROLES.QA] },
      deletedat: null,
    },
    "_id fullName email role"
  );

  return members;
};

const populateProject = async (projectId) => {
  return await ProjectModel.findById(projectId)
    .populate("members", "fullName email role")
    .populate("createdBy", "fullName email");
};
export const addMemberToProjectService = async (
  userId,
  projectId,
  memberId
) => {
  if (!memberId) throw new Error(PROJECTERRORS.MEMBER_ID_REQUIRED);

  const project = await ProjectModel.findOne({
    _id: projectId,
    createdBy: userId,
    deletedAt: null,
  });

  if (!project) throw new Error(PROJECTERRORS.PROJECT_NOT_FOUND);

  if (project.members.includes(memberId))
    throw new Error(PROJECTERRORS.MEMBER_EXISTS);

  project.members.push(memberId);
  await project.save();
  // Here we are sending email to member added
  const member = await UserModel.findById(memberId, "email fullName");
  if (member) {
    await sendProjectAddedEmail(member.email, project.name);
  }
  return await populateProject(project._id);
};

export const removeMemberFromProjectService = async (
  userId,
  projectId,
  memberId
) => {
  if (!memberId) throw new Error(PROJECTERRORS.MEMBER_ID_REQUIRED);

  const project = await ProjectModel.findOne({
    _id: projectId,
    createdBy: userId,
    deletedAt: null,
  });

  if (!project) throw new Error(PROJECTERRORS.PROJECT_NOT_FOUND);

  const memberIndex = project.members.indexOf(memberId);
  if (memberIndex === -1) throw new Error(PROJECTERRORS.MEMBER_NOT_FOUND);

  project.members.splice(memberIndex, 1);
  await project.save();
  const member = await UserModel.findById(memberId, "email fullName");
  if (member) {
    await sendProjectRemovedEmail(member.email, project.name);
  }

  return await populateProject(project._id);
};

// QA Related Functions:
export const getQAProjectsService = async (userId) => {
  const projects = await ProjectModel.find({
    members: new mongoose.Types.ObjectId(userId), // match QA in members array
    deletedAt: null,
  })
    .populate("members", "fullName email role")
    .populate("createdBy", "fullName email");

  return projects;
};
// Get all projects for a developer
export const getDeveloperProjectsService = async (userId) => {
  const projects = await ProjectModel.find({
    members: new mongoose.Types.ObjectId(userId),
    deletedAt: null,
  })
    .populate("members", "fullName email role")
    .populate("createdBy", "fullName email");

  return projects;
};

export const getProjectUsersService = async (projectId) => {
  const project = await ProjectModel.findById(projectId)
    .populate("members", "fullName email role")
    .populate("createdBy", "fullName email role");
  if (!project) throw new Error("Project not found");
  // Include manager as part of members
  const allMembers = [project.createdBy, ...project.members];
  return allMembers;
};
