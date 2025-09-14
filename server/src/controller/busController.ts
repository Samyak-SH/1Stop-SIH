import { Request, Response } from "express";
import { GCP_API_KEY } from "../config"
import { coordinates } from "../types/bus";
import {getNearestStopsModel} from "../model/busModel"
import { findRoute } from "../model/routeModel";
import { redisClient } from "../util";

export async function trackBus(req:Request, res:Response){
    try{
        const busCoordinates:coordinates = {
            lat : req.body.busPositionLat,
            lon : req.body.busPositionLon
        }
        const nextStopCoordinates:coordinates = {
            lat : req.body.nextStopLat,
            lon : req.body.nextStopLon
        }
        const _busID: string = req.body.busID;
        const _nextStopID: string = req.body.nextStopID;
        const _routeNo: string = req.body.routeNo;
        // note : %2C translates to , (comma) in URL encoding
        const origin: string = `${busCoordinates.lat}%2C${busCoordinates.lon}`
        const destination: string = `${nextStopCoordinates.lat}%2C${busCoordinates.lon}`
        const url: string = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&unit=metrics&key=${GCP_API_KEY}`

        const response:any = await fetch(url);
        const result:any = await response.json();

        // console.log("distance fetched", result.rows[0].elements[0]);

        const _distance = result.rows[0].elements[0].distance.value; //in meters
        const _duration = result.rows[0].elements[0].duration.value; //in seconds (extracted but not needed right now)

        const busInfo = {
            busId: _busID,
            routeNo: _routeNo,
            distance: _distance,
            duration: _duration,
        };
        await redisClient.hSet(`stops:${_nextStopID}`, _busID, JSON.stringify(busInfo));
        await redisClient.expire(`stops:${_nextStopID}`, 60) // expire after 60s
        res.status(200).json({distance : _distance, duration: _duration})
    }
    catch(err){
        res.status(500).json({message : "Internal server error, Failed to calculate distance"})
        console.error("Failed to calculate distance\n", err);
    }
}

export async function getNearestBusStops(req:Request, res:Response){
    try{
        const userCoordinates: coordinates = {
            lat : req.body.userLat,
            lon : req.body.userLon
        }
        const RANGE_IN_METER: number = 250;

        if (
            userCoordinates.lat === undefined ||
            userCoordinates.lon === undefined
        ) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const nearbyStops = await getNearestStopsModel(userCoordinates, RANGE_IN_METER);

        res.status(200).json({ stops: nearbyStops });

    }
    catch(err:any){
        console.error("Failed to get bus routes", err);
        res.status(500).json({message : "Failed to get bus routes"});
    }
}

export async function getNextStop(req: Request, res: Response) {
  try {
    const routeNo: string = req.body.routeNO;

    const prevCurrIndex = Number(req.body.currStopIndex);
    const prevNextIndex = Number(req.body.nextStopIndex);

    if (!Number.isInteger(prevCurrIndex) || !Number.isInteger(prevNextIndex)) {
      return res.status(400).json({ message: "currStopIndex and nextStopIndex must be integers" });
    }

    // working copies
    let currStopIndex: number = prevCurrIndex;
    let nextStopIndex: number = prevNextIndex;

    const route: any = await findRoute(routeNo);
    const routeType: string = route.routeType;
    const stopCount: number = route.stops.length;

    if (stopCount <= 0) {
      return res.status(200).json({ message: "route not found" });
    }

    // Decide direction using previous values (prevCurrIndex and prevNextIndex)
    if (routeType === "UD") {
      // if bus was moving forward (prevCurr < prevNext) then increment; otherwise decrement
      if (prevCurrIndex < prevNextIndex) {
        // forward
        if (prevNextIndex + 1 > stopCount - 1) {
          nextStopIndex = stopCount - 2; // bounce back one before last
        } else {
          nextStopIndex = prevNextIndex + 1;
        }
      } else {
        // backward
        if (prevNextIndex - 1 < 0) {
          nextStopIndex = 1; // bounce forward to index 1
        } else {
          nextStopIndex = prevNextIndex - 1;
        }
      }
    } else if (routeType === "C") {
      // circular
      if (prevNextIndex + 1 > stopCount - 1) {
        nextStopIndex = 0;
      } else {
        nextStopIndex = prevNextIndex + 1;
      }
    }

    // now update current to what used to be next
    currStopIndex = prevNextIndex;

    if (
      nextStopIndex < 0 ||
      nextStopIndex > stopCount - 1 ||
      currStopIndex < 0 ||
      currStopIndex > stopCount - 1
    ) {
      return res.status(400).json({ message: "calculated index out of range", nextStopIndex, currStopIndex });
    }

    console.log("stops length", stopCount);
    console.log("next stop index", nextStopIndex);
    console.log("cur stop index", currStopIndex);
    console.log("next stop details", route.stops[nextStopIndex]);
    console.log("cur stop details", route.stops[currStopIndex]);

    res.status(200).json({
      nextStop: {
        coordinates: route.stops[nextStopIndex].location.coordinates,
        stopId: route.stops[nextStopIndex].stopId,
        index: nextStopIndex,
      },
      currStop: {
        coordinates: route.stops[currStopIndex].location.coordinates,
        stopId: route.stops[currStopIndex].stopId,
        index: currStopIndex,
      },
    });
  } catch (err) {
    console.error("route not found", err);
    res.status(500).json({ message: "route not found" });
  }
}

export async function getBusesForStop(req:Request, res:Response){
    try {
        const stopId = req.body.stopId;
        const buses = await redisClient.hGetAll(`stops:${stopId}`);
        console.log(buses);

        // Convert JSON strings back into objects
        const result = Object.values(buses).map((b: string) => JSON.parse(b));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch buses for stop" });
        console.error("Error fetching buses for stop", err);
    }
}