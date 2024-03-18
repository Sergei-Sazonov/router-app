import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/common/types";

// Defines the schema for the User model, specifying the structure of user documents in the database.
const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 100 },
  },
  { timestamps: true }
);

// Finds a user by their email in the database.
const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

// Represents the User model, which is used to interact with user documents in the database.
const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel, findUserByEmail };
