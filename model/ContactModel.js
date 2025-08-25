import mongoose from "mongoose";
const { Schema } = mongoose;
const ContactModel = new Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }, // adds createdAt
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const ContactSchema = mongoose.model("Contact", ContactModel);
export default ContactSchema;
