import { Request, Response } from "express";
import { GCP_API_KEY } from "../config"
import { coordinates } from "../types/bus";
import {getNearestStopsModel} from "../model/busModel"
import { findRoute } from "../model/routeModel";

export async function checkStopDistance(req:Request, res:Response){
    try{
        const busCoordinates:coordinates = {
            lat : req.body.busPositionLat,
            lon : req.body.busPositionLon
        }
        const nextStopCoordinates:coordinates = {
            lat : req.body.nextStopLat,
            lon : req.body.nextStopLon
        }
        // note : %2C translates to , (comma) in URL encoding
        const origin: string = `${busCoordinates.lat}%2C${busCoordinates.lon}`
        const destination: string = `${nextStopCoordinates.lat}%2C${busCoordinates.lon}`
        const url: string = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&unit=metrics&key=${GCP_API_KEY}`

        const response:any = await fetch(url);
        const result:any = await response.json();

        // console.log("distance fetched", result.rows[0].elements[0]);

        const _distance = result.rows[0].elements[0].distance.value; //in meters
        const _duration = result.rows[0].elements[0].duration.value; //in seconds (extracted but not needed right now)
        res.status(200).json({distance : _distance})
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

export async function getNextBusStop(req:Request, res:Response){
    try{
        const routeNo: string = req.body.routeNO;
        let currStopIndex: number = req.body.currStopIndex;
        let nextStopIndex: number = req.body.nextStopIndex;
    
        const route = await findRoute(routeNo);
        if(route.length<=0){
            return res.status(200).json({message : "route not found"})
        }

        console.log("route", route);
        if(currStopIndex < nextStopIndex){
            currStopIndex = nextStopIndex;
            nextStopIndex++; 
        }
        res.status(200).json({route: route});        

    }
    catch(err){
        console.error("route not found", err);
        res.status(500).json({message: "route not found"})
    }
}