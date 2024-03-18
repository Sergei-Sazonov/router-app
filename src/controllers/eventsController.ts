import { Request, Response } from "express";
import { DestinationModel } from "../models/destinationModel";
import { chooseStrategy } from "../services/strategyService";

// Method for handling route event requests.
// Retrieves destination configurations from the database, then selects a strategy and processes the routing intents.
export const routeEvent = async (req: Request, res: Response) => {
  try {
    const destinations = await DestinationModel.find();

    if (!destinations?.length) {
      return res.status(404).send("Destination configuration not found");
    }

    const results: { [key: string]: boolean } = await chooseStrategy(
      destinations,
      req
    );

    res.send(results);
  } catch (error) {
    console.error(`Error while processing route event: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
