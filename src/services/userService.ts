import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { salt } from "../config";
import { UserModel } from "../models/userModel";
import { IUser } from "../utils/common/types";
import { createToken } from "./tokenService";

// Authenticate a user by comparing the provided password with the stored hashed password.
export const userLogin = async (req: Request, res: Response, user: IUser) => {
  const { password } = req.body;
  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) {
    throw new Error("Invalid password");
  }

  return createToken(user._id);
};

// Create a new user with the provided email, password, and name.
export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const createdUser = new UserModel({ name, email, password });
  const genSalt = await bcrypt.genSalt(Number(salt));

  createdUser.password = await bcrypt.hash(password, genSalt);
  await createdUser.save();

  return createdUser;
};
