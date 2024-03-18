import "dotenv/config";

export const port = process.env.PORT || 3000;
export const mongoURI = process.env.ATLAS_URI;
export const jwtkey = process.env.JWT_SECRET_KEY;
export const salt = process.env.SALT;
export const bytes = process.env.BYTES;
export const jwtExpireTime = process.env.JWT_EXPIRE;
