import axios from "axios";
import {
  IDestination,
  IEvent,
  TransportType,
} from "../models/destinationModel";

// Generates a message indicating the destination and transport method for a payload.
const getDestinationMessage = (destination: IDestination) =>
  `Payload sent to ${destination.destinationName} via ${destination.transport} transport`;

// Sends an event payload to the specified destination using the appropriate transport method.
export const sendEvent = async (
  destination: IDestination,
  event: IEvent
): Promise<boolean> => {
  try {
    switch (destination.transport) {
      case TransportType.post:
        if (destination.url) {
          const response = await axios.post(destination.url, event.payload);

          console.log(getDestinationMessage(destination));

          return response.status === 200;
        }
        break;
      case TransportType.put:
        if (destination.url) {
          const response = await axios.put(destination.url, event.payload);

          console.log(getDestinationMessage(destination));

          return response.status === 200;
        }
        break;
      case TransportType.get:
        if (destination.url) {
          const response = await axios.get(destination.url);

          console.log(getDestinationMessage(destination));

          return response.status === 200;
        }
        break;
      case TransportType.log:
        console.log(getDestinationMessage(destination));
        console.log(event.payload);

        return true;
      case TransportType.warn:
        console.warn(getDestinationMessage(destination));
        console.warn(event.payload);

        return true;
      default:
        console.error(`Unknown transport type: ${destination.transport}`);

        return false;
    }
  } catch (error) {
    console.error(
      `Error while sending event to ${destination.destinationName}: ${error.message}`
    );

    return false;
  }
};
