import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

export const createHash = password => bcrypt.hashSync(password, salt);

export const isValidPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

