import mongoose from "mongoose";
import { mongoURI } from "./config";
import { initializeDestinations } from "./models/destinationModel";

export const dbConnect = async () => {
  try {
    await mongoose.connect(mongoURI);
    initializeDestinations();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
