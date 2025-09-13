import {NextFunction, Request, Response} from "express"
import { redisClient } from "../util";
import { RATE_LIMIT, RATE_LIMIT_WINDOW_IN_SECONDS } from "../config";

export async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<Response|void> {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;

  try {
    const count = await redisClient.incr(key);

    if (count === 1) {
      // first request, set expiry window
      await redisClient.expire(key, RATE_LIMIT_WINDOW_IN_SECONDS);
    }

    if (count > RATE_LIMIT) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    // let requests go through if Redis fails
    next();
  }
}