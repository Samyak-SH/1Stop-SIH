import os from "os";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import {REDIS_HOST, REDIS_PORT} from "./config";


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

export const redisClient:RedisClientType = createClient({
  socket: {
    host : REDIS_HOST,
    port : REDIS_PORT
  }
});


