import * as express from "express";
import { routeEvent } from "../controllers/eventsController";
import { checkEventBody } from "../middleware/checkEventBody";
import { checkToken } from "../middleware/checkToken";

const router = express.Router();

router.post("/events", checkToken, checkEventBody, routeEvent);

export default router;
