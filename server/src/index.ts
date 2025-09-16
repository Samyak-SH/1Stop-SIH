require("dotenv").config({ path: "./.env" });
import express, { Request, Response } from "express";
import { startServer, app } from "./util";
import {
  trackBus,
  getNearestBusStops,
  getNextStop,
  getBusesForStop,
  getCommonRoutes,
} from "./controller/busController";
import { rateLimiter } from "./middleware/rateLimiter";

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

//APIs
app.get("/test", (req: Request, res: Response) => {
  res.json("server running");
});
app.post("/getNearestBustops", getNearestBusStops);
app.post("/getNextStop", getNextStop);
app.post("/getBusesForStop", getBusesForStop);
app.post("/getCommonRoutes", getCommonRoutes);

app.post("/trackBus", trackBus);

startServer();
