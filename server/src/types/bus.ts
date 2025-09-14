export interface Bus{
    _busCoordinates: coordinates
    _routeUp: boolean,
    _routeNo: string
    _prevStopCoordinates: coordinates
    _nextStopCoordinates: coordinates
    _crowDensity: number

}

export interface coordinates{
    lat: number
    lon: number
}