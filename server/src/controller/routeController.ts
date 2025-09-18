import {Request, Response} from "express"
import { createRoute } from "../model/routeModel";
import { RouteType, StopType } from "../types/stop";
import { createStop } from "../model/busModel";


export async function addNewRoute(req:Request, res:Response){
    try{
        console.log("req body", req.body);
        const r: RouteType = {
            routeNumber : req.body.routeNumber,
            routeType : req.body.routeType,
            stops : req.body.stops,
        }
        await createRoute(r);
        res.status(200).send({message : "Successfully added new Route"});
    }catch(err){
        console.error("Failed to add new route", err);
        res.status(500).json({message : "Failed to add new route"})
    }
}

export async function addNewStop(req:Request, res:Response){
    try{
        console.log("req body", req.body);
        const s: StopType = {
            stopId: req.body.stopId,
            name: req.body.name,
            location: {
                type: "Point",
                coordinates: req.body.location.coordinates
            },
            routes: req.body.routes || [],
        }
        console.log("Stop type", s);
        await createStop(s);
    }catch(err){
        console.error("Failed to add new stop", err);
        res.status(500).json({message : "Failed to add new stop"});
    }
}