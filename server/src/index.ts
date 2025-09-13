require("dotenv").config({path:"./.env"});
import express, {Request, Response} from "express"
import {startServer, app} from './util'
import {checkStopDistance, getNearestBusStops} from "./controller/busController"
import { rateLimiter } from "./middleware/rateLimiter";

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(rateLimiter);

//APIs
app.get("/test", (req:Request ,res:Response)=>{res.json("server running");})
app.get("/getNearestBustops", getNearestBusStops)

app.post("/checkStopDistance", checkStopDistance)

startServer();