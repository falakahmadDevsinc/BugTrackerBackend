export const ROLES = {
  MANAGER: "Manager",
  DEVELOPER: "Developer",
  QA: "QualityAssurance",
};
export const BUG_TYPES = ["feature", "bug"];
export const BUG_STATUS = {
  FEATURE: ["new", "started", "in-progress", "completed"],
  BUG: ["new", "started", "in-progress", "resolved"],
};

export const PROJECT_STATUS = ["active", "on-hold", "completed"];
export const PROJECTERRORS = {
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_NAME_REQUIRED: "Project name is required",
  PROJECT_START_REQUIRED: "Project start date is required",
  PROJECT_END_REQUIRED: "Expected end date is required",
  PROJECT_NAME_DUPLICATE: "Project name must be unique",
  NOT_AUTHORIZED: "Forbidden: Not authorized",
  MEMBER_EXISTS: "Member already exists in project",
  MEMBER_NOT_FOUND: "Member not found in project",
  MEMBER_ID_REQUIRED: "memberId is required",
};
export const BUGERRORS = {
  BUG_TYPE_INVALID: "Invalid bug type",
  BUG_STATUS_INVALID_FEATURE: "Invalid status for feature",
  BUG_STATUS_INVALID_BUG: "Invalid status for bug",
  BUG_REQUIRED_FIELDS: "Title, type, and status are required",
  BUG_PROJECT_NOT_FOUND: "Project not found",
  BUG_TITLE_DUPLICATE: "Bug title must be unique within this project",
  BUG_DEADLINE_INVALID: "Deadline must be a future date",
  BUG_NOT_FOUND: "Bug not found",
  DEVELOPER_NOT_IN_PROJECT: "Developer is not part of this project",
  BUG_STATUS_INVALID: "Invalid status value",
  BUG_NOT_ASSIGNED: "You are not assigned to this bug",
};
