//server config
export const SERVER_PORT: number = Number(process.env.SERVER_PORT)

//google API key
export const GCP_API_KEY: string = process.env.GCP_API_KEY as string

//redis config
export const REDIS_HOST: string = process.env.REDIS_HOST as string
export const REDIS_PORT: number = Number(process.env.REDIS_PORT);