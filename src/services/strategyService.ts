import { Request } from "express";
import { bytes } from "../config";
import { IDestination, IRoutingIntents } from "../models/destinationModel";
import { StrategyType } from "../utils/common/types";
import { sendEvent } from "./destinationService";

// Retrieves the destination associated with the given intent from the provided list of destinations.
const getDestinationByIntent = (
  destinations: IDestination[],
  intent: IRoutingIntents
) => {
  return destinations.find(
    (dest) => dest.destinationName === intent.destinationName
  );
};

// Implements the 'ALL' strategy for routing events to destinations.
export const allStrategy = async (
  destinations: IDestination[],
  payload: any,
  routingIntents: IRoutingIntents[]
): Promise<{ [key: string]: boolean }> => {
  const results: { [key: string]: boolean } = {};

  for (const intent of routingIntents) {
    const destination = getDestinationByIntent(destinations, intent);

    if (destination) {
      results[intent.destinationName] = await sendEvent(destination, payload);
    } else {
      console.log(`UnknownDestinationError (${intent.destinationName})`);
      results[intent.destinationName] = false;
    }
  }

  return results;
};

// Implements the 'IMPORTANT' strategy for routing events to destinations.
export const importantStrategy = async (
  destinations: IDestination[],
  payload: any,
  routingIntents: IRoutingIntents[]
): Promise<{ [key: string]: boolean }> => {
  const results: { [key: string]: boolean } = {};

  for (const intent of routingIntents) {
    const destination = getDestinationByIntent(destinations, intent);

    if (intent.important && destination) {
      results[intent.destinationName] = await sendEvent(destination, payload);
      continue;
    }

    results[intent.destinationName] = false;

    if (!destination) {
      console.log(`UnknownDestinationError (${intent.destinationName})`);
    } else {
      console.log(`${intent.destinationName} skipped`);
    }
  }

  return results;
};

// Implements the 'SMALL' strategy for routing events to destinations.
export const smallStrategy = async (
  destinations: IDestination[],
  payload: any,
  routingIntents: IRoutingIntents[]
): Promise<{ [key: string]: boolean }> => {
  const results: { [key: string]: boolean } = {};

  for (const intent of routingIntents) {
    const destination = getDestinationByIntent(destinations, intent);

    if (!destination) {
      console.log(`UnknownDestinationError (${intent.destinationName})`);
      results[intent.destinationName] = false;
      continue;
    }

    if (intent.bytes < Number(bytes)) {
      results[intent.destinationName] = await sendEvent(destination, payload);
    } else {
      console.log(`${intent.destinationName} skipped`);
      results[intent.destinationName] = false;
    }
  }

  return results;
};

// Implements the 'CUSTOM CLIENT DEFINED' strategy for routing events to destinations based on a client-provided strategy function.
export const customStrategy = async (
  destinations: IDestination[],
  payload: any,
  routingIntents: IRoutingIntents[],
  clientStrategy: string
): Promise<{ [key: string]: boolean }> => {
  try {
    const filteredIntents = eval(`(${clientStrategy})(routingIntents)`);
    const results: { [key: string]: boolean } = {};

    for (const intent of routingIntents) {
      const destination = getDestinationByIntent(destinations, intent);

      if (!destination) {
        results[intent.destinationName] = false;
        console.log(`UnknownDestinationError (${intent.destinationName})`);
        continue;
      }

      const included = filteredIntents.some(
        (filteredIntent: any) =>
          filteredIntent.destinationName === intent.destinationName
      );

      if (!included) {
        results[intent.destinationName] = false;
        console.log(`[${intent.destinationName}] skipped`);
      } else {
        results[intent.destinationName] = await sendEvent(destination, payload);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error while processing custom strategy: ${error.message}`);
    throw new Error("Invalid request. Please check your strategy");
  }
};

// Choose a routing strategy based on the specified strategy type.
export const chooseStrategy = (destinations: IDestination[], req: Request) => {
  const { payload, routingIntents, strategy } = req.body;

  switch (strategy) {
    case StrategyType.all:
      return allStrategy(destinations, payload, routingIntents);
    case StrategyType.important:
      return importantStrategy(destinations, payload, routingIntents);
    case StrategyType.small:
      return smallStrategy(destinations, payload, routingIntents);
    default:
      return customStrategy(destinations, payload, routingIntents, strategy);
  }
};
