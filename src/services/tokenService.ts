import jwt from "jsonwebtoken";
import { jwtExpireTime, jwtkey } from "../config";

// Create a JWT token using the provided user ID.
export const createToken = (id: string) =>
  jwt.sign({ id }, jwtkey, { expiresIn: jwtExpireTime });

// Decode the data encoded in a JWT token.
export const decodeTokenData = (token: string) =>
  jwt.verify(token.replace(/^Bearer\s+/, ""), jwtkey);
