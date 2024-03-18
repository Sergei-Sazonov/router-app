import { Request, Response } from "express";
import { findUserByEmail } from "../models/userModel";
import { createToken } from "../services/tokenService";
import { createUser, userLogin } from "../services/userService";
import { MessageType } from "../utils/common/types";

// Method for handling user login requests.
// Finds a user by email and if found, generates and returns a login token.
export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("This user is not exists");
    }

    const token = await userLogin(req, res, user);

    res.status(200).json({
      message: MessageType.loggedIn,
      token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Method for handling new user registration requests.
// Checks if a user with the provided email already exists, if not - creates a new user and generates a token for them.
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const foundUser = await findUserByEmail(email);

    if (foundUser) {
      throw new Error("This user already exists");
    }

    const { _id } = await createUser(email, password, name);
    const token = createToken(_id);

    res.status(200).json({
      message: MessageType.registered,
      user: {
        email,
        name,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
