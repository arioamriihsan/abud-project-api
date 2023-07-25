import bcrypt from "bcrypt";
import { jwtConfig } from "../config/config";

export const encryptAsync = (password: string): Promise<string> =>
  bcrypt.hash(password, jwtConfig.saltRound);

export const encryptSync = (password: string): string =>
  bcrypt.hashSync(password, jwtConfig.saltRound);

export const compareSync = (password: string, hash: string): boolean =>
  bcrypt.compareSync(password, hash);

export const compareAsync = (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);
