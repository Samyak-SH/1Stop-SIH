import mongoose from "mongoose";
import { coordinates } from "../types/bus";
import { StopType } from "../types/stop";

const stopSchema = new mongoose.Schema({
  stopId: String,
  name: String,
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  routes: [
    {
      routeNumber: { type: String, required: true },
      index: { type: Number, required: true },
    },
  ],
});


// note coordinates = [lon, lat] in mongodb (follows reverse order)
// general convention (in google maps) = [lat, lon]

const Stops = mongoose.model("Stops", stopSchema, "Stops");

export async function getNearestStopsModel(userCoordinates: coordinates, RANGE_IN_METER: number) {
    const nearbyStops = await Stops.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [userCoordinates.lon, userCoordinates.lat]
                },
                $maxDistance: RANGE_IN_METER
            }
        }
    });

    // const nearbyStops = await Stops.find()

    return nearbyStops
}

export async function getCommonRoutesModel(sourceId: string, destinationId: string): Promise<string[]> {
    const stops = await Stops.find({
        stopId: { $in: [sourceId, destinationId] },
    }).select("routes stopId");

    if (stops.length < 2) {
        throw new Error("One or both stops not found");
    }
    console.log("stops", stops);
    // Safely destructure
    const routes1 = stops[0]?.routes ?? [];
    const routes2 = stops[1]?.routes ?? [];
    console.log("1", routes1, "\n\n2", routes2);

    // Intersection
    const common: string[] = routes1.filter((r1) => 
        routes2.some((r2) => r1.routeNumber === r2.routeNumber)
    ).map(r => r.routeNumber);
    console.log("common", common);

    return common;
}

export async function getAllStopModel(){
    const result = await Stops.find({});
    return result;
}

export async function createStop(stop:StopType) {
    await Stops.insertOne(stop);
}