import { Request, Response } from "express";
import { GCP_API_KEY } from "../config"
import { coordinates } from "../types/bus";

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
        console.error("Failed to calculate distance\n", err);
    }
}