import mongoose from "mongoose";
import { coordinates } from "../types/bus";

const stopSchema = new mongoose.Schema({
  stopId: String,
  name: String,
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  routes: [String]
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