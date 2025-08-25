import ContactSchema from "../model/ContactModel.js";

export const createContact = async ({ name, email, message }) => {
  return await ContactSchema.create({ name, email, message });
};
