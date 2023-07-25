import { Response, NextFunction } from "express";
import { get } from "lodash";
import { Language, customRequest } from "customDefinition";

const languageDetector = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const language: Language = get(req, "headers.language");
  req.language = language;
  
  return next();
};

export default languageDetector;
