import crypto from "crypto";

export const generateOTP = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};
