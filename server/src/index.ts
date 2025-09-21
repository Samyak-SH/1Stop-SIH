require("dotenv").config({ path: "./.env" });
import express, { Request, Response } from "express";
import { startServer, app } from "./util";
import cors from "cors";
import multer from "multer";

import {
  trackBus,
  getNearestBusStops,
  getNextStop,
  getBusesForStop,
  getCommonRoutes,
  getRoute,
  getAllStops,
  calcCrowdDensity
} from "./controller/busController";

import { addNewRoute, addNewStop } from "./controller/routeController";
import { rateLimiter } from "./middleware/rateLimiter";

// Multer Setup 
const tmpDir = "uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed!"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(rateLimiter);

// Routes
app.get("/test", (req: Request, res: Response) => res.json("server running"));

app.post("/getNearestBustops", getNearestBusStops);
app.post("/getBusesForStop", getBusesForStop);
app.post("/getCommonRoutes", getCommonRoutes);
app.post("/trackBus", trackBus);
app.post("/getNextStop", getNextStop);
app.post("/addNewRoute", addNewRoute);
app.post("/addNewStop", addNewStop);
app.post("/calcCrowdDensity", upload.single("image"), calcCrowdDensity);

app.get("/getRoute", getRoute);
app.get("/getAllStops", getAllStops);

startServer();
