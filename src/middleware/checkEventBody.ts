import { NextFunction, Request, Response } from "express";
import { MessageType } from "../utils/common/types";

// Middleware function to validate the request body of an event.
// Checks if the payload, routingIntents, and strategy are present in the request body.
// If any of these fields are missing, sends a 400 Bad Request response.
export const checkEventBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body?.payload || !req.body?.routingIntents || !req.body?.strategy) {
    return res.status(400).json({ message: MessageType.invalidReqBody });
  }

  next();
};
