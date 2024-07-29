import bcrypt from "bcryptjs";

async function getPasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function matchPasswordWithHash(plainPasswordStr, hashedPassword) {
  const result = await bcrypt.compare(plainPasswordStr, hashedPassword);
  return result;
}

export { getPasswordHash, matchPasswordWithHash };