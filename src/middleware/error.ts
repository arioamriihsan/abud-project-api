import { customError, customRequest } from "customDefinition";
import { Response } from "express";
import { ApiError } from "../util/ApiError";

/**
 * Error Handler Middleware
 * @param error
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (
  error: customError,
  req: customRequest,
  res: Response
): void => {
  const language = req.language;
  let err = error;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || "Terjadi kesalahan pada server";
    err = new ApiError(statusCode, language, message);
  }

  const { statusCode, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
  };
  res.status(statusCode).json(response);
};
