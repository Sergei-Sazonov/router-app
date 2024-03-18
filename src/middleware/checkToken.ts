import { NextFunction, Request, Response } from "express";
import { decodeTokenData } from "../services/tokenService";
import { MessageType } from "../utils/common/types";

// Middleware function to check the validity of the authorization token in the request headers.
// Verifies if the token exists and decodes it to validate its authenticity.
// If the token is missing or invalid, sends a 401 Unauthorized response.
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: MessageType.unauthorized });
    }

    const decoded = decodeTokenData(token);

    if (!decoded) {
      return res.status(401).json({ message: MessageType.invalidToken });
    }

    next();
  } catch (error) {
    console.error(`Error while decoding token: ${error.message}`);
    return res.status(401).json({ message: MessageType.invalidToken });
  }
};
