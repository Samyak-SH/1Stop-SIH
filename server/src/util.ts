import os from "os";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import express, { Application } from "express";
import mongoose from "mongoose";
import {
  REDIS_HOST,
  REDIS_PORT,
  MAX_START_RETRIES,
  MONGODB_URL,
  SERVER_PORT,
  START_RETRY_DELAY_MS,
} from "./config";
import { Stop, Route, CommonRouteResult } from "./types/bus";

//this gives local/private ip assinged by the router, only useful when communicating with devices connected to the same network
export async function getServerIP(): Promise<string> {
  const nets = os.networkInterfaces();
  let localIP = "127.0.0.1";

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  return localIP;
}

//redis client
export const redisClient: RedisClientType = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

//express server
export const app: Application = express();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export async function startServer() {
  console.log("MONGODB_URL", MONGODB_URL);
  console.log("REDIS_HOST", REDIS_HOST);
  let retries = 0;

  while (retries < MAX_START_RETRIES) {
    try {
      await mongoose.connect(MONGODB_URL);
      console.log("Database connected successfully");

      await redisClient.connect();
      console.log("Redis connected successfully");

      app.listen(SERVER_PORT, "0.0.0.0", async () => {
        const ip: string | null = await getServerIP();
        console.log(`Server started at http://${ip}:${SERVER_PORT}`);
      });

      break;
    } catch (err) {
      retries++;
      console.error(
        `Failed to connect to DB (attempt ${retries}/${MAX_START_RETRIES})`
      );
      console.error(err);

      if (retries === MAX_START_RETRIES) {
        console.error("Max retries reached. Exiting.");
        process.exit(1);
      }

      console.log(`Retrying in ${START_RETRY_DELAY_MS / 1000}s...\n`);
      await delay(START_RETRY_DELAY_MS);
    }
  }
}

/**
 * Finds common routes between start and destination stops
 * @param startStopId - ID of the starting stop
 * @param destinationStopId - ID of the destination stop
 * @param stops - Array of all stops with their route information
 * @param routes - Array of all routes with their stop sequences
 * @returns Array of common routes with direction and stop indices
 */
export function findCommonRoutes(
  startStopId: string,
  destinationStopId: string,
  stops: Stop[],
  routes: Route[]
): CommonRouteResult[] {
  // Find the start and destination stops
  const startStop = stops.find((stop) => stop.stopId === startStopId);
  const destinationStop = stops.find(
    (stop) => stop.stopId === destinationStopId
  );

  if (!startStop || !destinationStop) {
    throw new Error(
      `Stop not found: ${!startStop ? startStopId : destinationStopId}`
    );
  }

  // Get route numbers for both stops
  const startRouteNumbers = new Set(
    startStop.routes.map((route) => route.routeNumber)
  );
  const destinationRouteNumbers = new Set(
    destinationStop.routes.map((route) => route.routeNumber)
  );

  // Find common route numbers
  const commonRouteNumbers = [...startRouteNumbers].filter((routeNumber) =>
    destinationRouteNumbers.has(routeNumber)
  );

  const results: CommonRouteResult[] = [];

  // For each common route, determine direction and validate the path
  for (const routeNumber of commonRouteNumbers) {
    const route = routes.find((r) => r.routeNumber === routeNumber);
    if (!route) continue;

    // Find indices of start and destination stops in this route
    const startStopIndex = route.stops.findIndex(
      (stop) => stop.stopId === startStopId
    );
    const destinationStopIndex = route.stops.findIndex(
      (stop) => stop.stopId === destinationStopId
    );

    if (startStopIndex === -1 || destinationStopIndex === -1) continue;

    // Determine direction based on stop indices
    if (startStopIndex < destinationStopIndex) {
      // Forward direction (start comes before destination in route sequence)
      results.push({
        routeNumber,
        startStopIndex,
        destinationStopIndex,
        direction: "forward",
      });
    } else if (startStopIndex > destinationStopIndex) {
      // Backward direction (start comes after destination in route sequence)
      results.push({
        routeNumber,
        startStopIndex,
        destinationStopIndex,
        direction: "backward",
      });
    }
    // If startStopIndex === destinationStopIndex, it's the same stop, so we skip it
  }

  return results;
}
