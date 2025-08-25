import mongoose from "mongoose";

const { Schema } = mongoose;

const RecipientSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRead: { type: Boolean, default: false },
});

const NotificationSchema = new Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  bug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bug",
    required: true,
  },
  recipients: [RecipientSchema], // 👈 array of users
  message: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;
