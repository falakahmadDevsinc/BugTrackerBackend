import mongoose from "mongoose";
const { Schema } = mongoose;
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["active", "on-hold", "completed"],
    default: "active",
  },
  startDate: { type: Date, required: true },
  expectedEndDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});
// compound index: name + createdBy must be unique together
ProjectSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const ProjectModel = mongoose.model("Project", ProjectSchema);
export default ProjectModel;
