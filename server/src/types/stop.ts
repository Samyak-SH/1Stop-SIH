export interface RouteType{
    routeNumber : string,
    routeType : string,
    stops : [string],
}
export interface StopType{
    stopId : string,
    name : string,
    location : {
        type : "Point",
        coordinates : [number]
    },
    routes : [string]
}
