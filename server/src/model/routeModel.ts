import mongoose from "mongoose";

const stopSchemaForRoute = new mongoose.Schema({
    index: Number,
    stopId: String,
    name: String,
    location: {
        type: { type: String },   // e.g. "Point"
        coordinates: [Number]     // [longitude, latitude]
    }
}, { _id: false });

const routeSchema = new mongoose.Schema({
    routeNumber: String,
    routeType: String,
    stops: [stopSchemaForRoute]
})

const Route= mongoose.model("Routes", routeSchema, "Routes");

export async function findRoute(routeNo: string) {
    const route = await Route.findOne({routeNumber: routeNo});
    return route
}