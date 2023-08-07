import { findOneUser, updateUserById } from "../services/userService";
import { NextFunction, Response } from "express";
import { omit } from "lodash";
import { customRequest } from "../types/customDefinition";
import { ApiError } from "../util/ApiError";

const omitData = ["password", "refresh_token", "created_at"];;

export const updateUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const { id: userId } = req.user;
    const language = req.language;

    let body = req.body;
    body = omit(body, omitData);

    const user = await findOneUser({ id: userId });

    if (!user) {
      throw new ApiError(400, language, "User not found");
    }

    const updated = await updateUserById(body, parseInt(userId, 10));

    return res.status(200).json({
      updated: updated[0],
      msg: updated[0] ? "Data updated successfully" : "failed to update",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    return res.status(200).json({
      data: omit(req.user, omitData),
      error: false,
    });
  } catch (err) {
    next(err);
  }
};
