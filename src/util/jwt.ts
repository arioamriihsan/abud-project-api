import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/config";

export const sign = (
  key: "accToken" | "refToken",
  payload: any
): string => {
  if (key === "accToken") {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiry + "h" });
  }
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, { expiresIn: jwtConfig.refreshTokenExpiry + "h" });
};

export const verify = (token: string): any => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    let msg;
    if (error instanceof Error) {
      msg = error.message;
    } else {
      msg = error;
    }
    return {
      valid: false,
      expired: msg === "jwt expired",
      msg: msg,
      decoded: null as null,
    };
  }
};
