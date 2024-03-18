import { Schema, model } from "mongoose";
import { destinations } from "../utils/common/destination";
import {
  IDestination,
  IEvent,
  IRoutingIntents,
  TransportType,
} from "../utils/common/types";

// Defines the schema for the Destination model, specifying the structure of destination documents in the database.
const destinationSchema = new Schema<IDestination>({
  destinationName: { type: String, required: true, unique: true },
  transport: {
    type: String,
    enum: Object.values(TransportType),
    required: true,
  },
  url: { type: String },
});

// Initializes the destinations in the database by first deleting all existing destinations and then inserting new ones.
// This method used during the setup phase of the application to ensure a clean state for destinations.
const initializeDestinations = async () => {
  try {
    await DestinationModel.deleteMany();
    await DestinationModel.insertMany(destinations);
    console.log("Destinations initialized");
  } catch (error) {
    console.error("Error initializing destinations:", error);
  }
};

// Represents the Destination model, which is used to interact with destination documents in the database.
const DestinationModel = model<IDestination>("Destination", destinationSchema);

export {
  DestinationModel,
  IDestination,
  IEvent,
  IRoutingIntents,
  TransportType,
  initializeDestinations,
};
