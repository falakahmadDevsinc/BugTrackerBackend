import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../utils/config/config.js";

const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Manager", "Developer", "QualityAssurance"],
    default: "Developer",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, config.bcryptSaltRounds);
  this.password = hash;
  next();
});
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
