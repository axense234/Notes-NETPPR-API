import bcrypt from "bcryptjs";

// ENCRYPT PASSWORD
const encryptPassword = async (pass: string) => {
  const salt = await bcrypt.genSalt(14);
  const encryptedPassword = await bcrypt.hash(pass, salt);
  return encryptedPassword;
};

// COMPARE PASSWORDS
const comparePasswords = async (pass: string, epass: string) => {
  const match = await bcrypt.compare(pass, epass);
  return match;
};

// EXPORTS
export { encryptPassword, comparePasswords };
