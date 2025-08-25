import mongoose from "mongoose";

const { Schema } = mongoose;

const BugSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, default: "" },
  screenshot: {
    type: String, // store file path or cloud URL
    validate: {
      validator: function (value) {
        if (!value) return true; // optional
        return /\.(png|gif)$/i.test(value); // only png/gif
      },
      message: "Screenshot must be a .png or .gif file",
    },
  },
  type: {
    type: String,
    enum: ["feature", "bug"],
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "started", "in-progress", "completed", "resolved"],
    required: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: true,
  },

  deadline: { type: Date, required: false },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Compound index → title must be unique per project
BugSchema.index({ title: 1, project: 1 }, { unique: true });

const BugModel = mongoose.model("Bug", BugSchema);
export default BugModel;
