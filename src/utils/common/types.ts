import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export enum StrategyType {
  all = "ALL",
  important = "IMPORTANT",
  small = "SMALL",
}

export enum TransportType {
  post = "http.post",
  put = "https.put",
  get = "http.get",
  log = "console.log",
  warn = "console.warn",
}

export enum MessageType {
  unauthorized = "Unauthorized",
  invalidToken = "Invalid token",
  invalidReqBody = "Invalid request body",
  loggedIn = "User successfully logged in",
  registered = "User successfully registered",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export interface IEvent extends Document {
  payload: any;
  routingIntents: {
    destinationName: string;
    important?: boolean;
    bytes?: number;
  }[];
  strategy?: string;
}

export interface IDestination extends Document {
  _id: ObjectId;
  destinationName: string;
  transport: string;
  url?: string;
  __v: number;
}

export interface IRoutingIntents extends Document {
  destinationName: string;
  important?: boolean;
  bytes?: number;
}
