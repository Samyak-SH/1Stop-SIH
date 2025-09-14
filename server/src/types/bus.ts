export interface Bus {
  _busCoordinates: coordinates;
  _routeUp: boolean;
  _routeNo: string;
  _prevStopCoordinates: coordinates;
  _nextStopCoordinates: coordinates;
  _crowDensity: number;
}

export interface coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface RouteInfo {
  routeNumber: string;
  index: number;
}

export interface Stop {
  stopId: string;
  name: string;
  location: Location;
  routes: RouteInfo[];
}

export interface RouteStop {
  index: number;
  stopId: string;
  name: string;
  location: Location;
}

export interface Route {
  routeNumber: string;
  stops: RouteStop[];
}

export interface CommonRouteResult {
  routeNumber: string;
  startStopIndex: number;
  destinationStopIndex: number;
  direction: "forward" | "backward";
}
