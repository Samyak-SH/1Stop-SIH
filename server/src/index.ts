require("dotenv").config({path:"./.env"});
import express, {Application, Request, Response} from "express"
import {getServerIP, redisClient} from './util'
import { SERVER_PORT} from "./config";
import {checkStopDistance} from "./controller/busController"

const app:Application = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//APIs
app.get("/test", (req:Request ,res:Response)=>{
    res.json("server running");
})

app.post("/checkStopDistance", checkStopDistance)

async function startServer(){

    try{
        //connect with redis client
        await redisClient.connect()
        console.log("Redis connected successfully");
    
        //start server
        app.listen(SERVER_PORT, '0.0.0.0', async () => {
            const ip: string | null = await getServerIP();
            console.log(`server started on http://${ip}:${SERVER_PORT}`)
        })
    }catch(err){
        console.error("FAILED TO START SERVER!!!!!!!!!!!!!\n", err);
    }
}

startServer();