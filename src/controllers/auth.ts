import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { omit } from "lodash";
import { sign } from "../util/jwt";
import { generateOTP, verifyOTP } from "../util/otp";
import { sendOTP } from "../helpers/mailHelper";
import { ApiError } from "../util/ApiError";
import { customRequest } from "customDefinition";
import User from "../model/models/User";
import {
  findOneUser,
  updateUserById,
  validatePassword,
} from "../services/userService";
import { jwtConfig } from "../config/config";

const omitData = ["password", "refresh_token", "created_at"];

export const loginUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const { username, password } = req.body;
    const language = req.language;

    if (!username || !password) {
      const err = new ApiError(400, language, {
        id: "Nama Akun & Kata Sandi Harus diisi",
        en: "Username & Password must be provided",
      });
      return res.status(400).json(err);
    }

    const user = await findOneUser({ username });
    if (!user) {
      const err = new ApiError(400, language, {
        id: "Nama Akun tidak ditemukan",
        en: "Username not found",
      });
      return res.status(400).json(err);
    }

    const hasChangedPassword = user.has_changed_password;

    const hasValidPassword = await validatePassword(
      username,
      password,
      hasChangedPassword
    );
    if (!hasValidPassword) {
      const err = new ApiError(400, language, {
        id: "Nama Akun & Kata Sandi Salah",
        en: "Incorrect Username & Password",
      });
      return res.status(400).json(err);
    }

    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign("accToken", { ...userData });
    const refreshToken = sign("refToken", { ...userData });

    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      data: userData,
      access_token: accessToken,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const language = req.language;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const err = new ApiError(401, language, {
        id: "Sesi kamu telah berakhir, silakan masuk akun kembali",
        en: "Your session has expired, please login",
      });
      return res.status(401).json(err);
    }

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) {
      const err = new ApiError(403, language, {
        id: "Token tidak valid",
        en: "Invalid token",
      });
      return res.status(403).json(err);
    }

    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, (err: any, decoded: any) => {
      if (err) {
        if (err?.message === "jwt expired") {
          const err = new ApiError(403, language, {
            id: "Sesi kamu telah berakhir, silakan masuk akun kembali",
            en: "Your session has expired, please login",
          });
          return res.status(403).json(err);
        }
        return res.status(403).json(err);
      }

      const userData = omit(user?.toJSON(), omitData);
      const accessToken = sign("accToken", { ...userData });

      return res.status(200).json({
        access_token: accessToken,
        error: false,
      });
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const language = req.language;
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return new ApiError(204, language, {
        id: "Tidak ada content",
        en: "No Content,",
      });
    }

    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) {
      return new ApiError(204, language, {
        id: "Tidak ada content",
        en: "No Content,",
      });
    }

    await User.update(
      { refresh_token: null },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: language === "en" ? "Logout success" : "Berhasil keluar akun",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const { email } = req.body;
    const language = req.language;

    let user = await findOneUser({ email });
    if (!user) {
      throw new ApiError(400, language, {
        id: "Email id salah",
        en: "Email id is incorrect",
      });
    }
    user = user?.toJSON();
    // generate otp
    const otp = generateOTP(user.email);

    const send = await sendOTP(user.email, otp);
    // send otp to email
    if (!send) {
      throw new ApiError(400, language, {
        id: "Gagal mengirim kode OTP",
        en: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      msg: "Email sent sucessfully",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: customRequest,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  try {
    const { email, otp, password } = req.body;
    const language = req.language;

    let user = await findOneUser({ email });
    if (!user) {
      throw new ApiError(400, language, {
        id: "Email id salah",
        en: "Email id is incorrect",
      });
    }
    user = user?.toJSON();
    const isValid = verifyOTP(user.email, otp);

    if (!isValid) {
      return res.status(400).send({
        error: true,
        errorMsg: "OTP is Incorrect",
      });
    }

    const updated = await updateUserById({ password }, user.id);

    return res.status(200).json({
      updated: updated[0],
      msg: updated[0] ? "Password reseted successfully" : "Failed to reset",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};
