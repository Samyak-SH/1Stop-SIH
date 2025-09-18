import {Request, Response} from "express"
import { createRoute } from "../model/routeModel";
import { RouteType } from "../types/stop";


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