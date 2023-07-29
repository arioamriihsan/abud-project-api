import { Response, NextFunction } from "express";
import { get } from "lodash";
import { verify } from "../util/jwt";
import { customRequest } from "../types/customDefinition";

const deserializeUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const bearerToken = get(req, "headers.authorization");
  let token = bearerToken;
  if (bearerToken) {
    token = bearerToken.substring(7);
  }
 
  if (!token) return next();
  
  const { decoded, expired, valid, msg: errorMsg } = verify(token);

  if (valid && !expired) {
    req.user = decoded;
    return next();
  } 
  return res.status(403).json({
    error: true,
    message: errorMsg,
  });
};

export default deserializeUser;
