// server config
export const SERVER_PORT: number = Number(process.env.SERVER_PORT)
export const MAX_START_RETRIES: number = Number(process.env.MAX_START_RETRIES);
export const START_RETRY_DELAY_MS: number = Number(process.env.START_RETRY_DELAY_MS); // in milliseconds

// google API key
export const GCP_API_KEY: string = process.env.GCP_API_KEY as string

// redis config
export const REDIS_HOST: string = process.env.REDIS_HOST as string
export const REDIS_PORT: number = Number(process.env.REDIS_PORT);

// rate limiter config
export const RATE_LIMIT: number = Number(process.env.RATE_LIMIT)
export const RATE_LIMIT_WINDOW_IN_SECONDS: number = Number(process.env.RATE_LIMIT_WINDOW_IN_SECONDS)

// mongoDB config
export const MONGODB_URL: string = process.env.MONGODB_URL as string

// note:
// if server is running inside a container sharing the same network as redis and mongodb containers, the hostname 
// for mongodb(in MONGODB_URL) and REDIS_HOST will be same as the service name mentioned in docker-compose.yaml
// if server is running on the host machine, then use 'localhost' as hostname and let port forwarding take care of
// the rest