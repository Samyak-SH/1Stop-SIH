import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    routeNumber: String,

})

const Route= mongoose.model("Routes", routeSchema, "Routes");

export async function findRoute(routeNo: string) {
    const route = await Route.find({routeNumber: routeNo});
    return route
}