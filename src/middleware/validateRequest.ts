import { Response, NextFunction } from "express";
import { Schema } from "joi";
import { customRequest } from "customDefinition";
import { ApiError } from "../util/ApiError";

const validateRequest = (schema: Schema) => {
  return (
    req: customRequest,
    res: Response,
    next: NextFunction
  ): void | Response<unknown> => {
    const { error } = schema.validate(req.body);
    const language = req.language;
    const valid = error == null;

    if (valid) {
      return next();
    } 
    const { message } = error;

    const err = new ApiError(400, language, message);
    return res.status(400).json(err);
  };
};
export default validateRequest;
