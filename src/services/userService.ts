import { encryptSync } from "../util/encrypt";
import User from "../model/models/User";
import { Op } from "sequelize";
import { isEqual } from "lodash";

export const createUser = async (payload: any): Promise<User> => {
  payload.password = encryptSync(payload.password);
  const user = await User.create(payload);
  return user;
};

export const getUserById = async (id: number): Promise<User> => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const userExists = async (
  options: { email: string | null; mobile: string | null } = {
    email: null,
    mobile: null,
  }
): Promise<boolean> => {
  if (!options.email) {
    throw new Error("Please provide either of these options: email");
  }
  const where: any = {
    [Op.or]: [],
  };
  if (options.email) {
    where[Op.or].push({ email: options.email });
  }
  if (options.mobile) {
    where[Op.or].push({ email: options.mobile });
  }

  const users = await User.findAll({ where: where });
  return users.length > 0;
};

export const validatePassword = async (
  username: string,
  password: string,
  hasChangedPassword: boolean
): Promise<boolean> => {
  const where = {
    [Op.or]: [] as any,
  };

  if (username) {
    where[Op.or].push({ username });
  }

  const user = await User.findOne({ where });

  if (!hasChangedPassword) {
    return isEqual(password, user.password);
  }

  return User.validPassword(password, user.password);
};

export const findOneUser = async (options: any): Promise<User> => {
  if (!options.username && !options.id) {
    throw new Error("Please provide username or id ");
  }
  const where = {
    [Op.or]: [] as any,
    status: true
  };

  if (options.username) {
    where[Op.or].push({ username: options.username, });
  }
  if (options.id) {
    where[Op.or].push({ id: options.id });
  }

  const user = await User.findOne({
    where,
    attributes: { exclude: ["password"] },
  });
  return user;
};

export const updateUserById = (user: any, userId: number): Promise<[affectedCount: number]> => {
  if (!user && !userId) {
    throw new Error("Please provide user data and/or user id to update");
  }
  if (userId && isNaN(userId)) {
    throw new Error("Invalid user id");
  }
  if (user.id || userId) {
    const id = user.id || userId;

    if (user.password) {
      user.password = encryptSync(user.password);
    }

    return User.update(user, {
      where: { id: id },
    });
  }
};

export const deleteUserById = (userId: number): Promise<number> => {
  if (!userId) {
    throw new Error("Please user id to delete");
  }
  if (userId && isNaN(userId)) {
    throw new Error("Invalid user id");
  }

  return User.destroy({
    where: { id: userId },
  });
};
