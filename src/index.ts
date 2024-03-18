import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "node:http";
import { port } from "./config";
import { dbConnect } from "./db";
import logger from "./logger";
import authRoute from "./routes/authRoute";
import eventsRoute from "./routes/eventsRoute";

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/", authRoute);
app.use("/", eventsRoute);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// Database Connection
dbConnect();

// Server Listening
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
