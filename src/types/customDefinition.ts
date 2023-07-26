import { NextFunction, Request, Response } from "express";

export interface customRequest extends Request {
  user: any;
  language: string;
}

export interface customError extends Error {
  statusCode: number;
}

export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type LanguageType = "id" | "en";