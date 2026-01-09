import bcrypt from "bcryptjs";

export const comparePassword = async (dbPass, payloadPass) => {
  return await bcrypt.compare(payloadPass, dbPass);
};
