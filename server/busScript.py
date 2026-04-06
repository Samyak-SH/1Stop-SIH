import requests
import time

# Config
SERVER_URL = "http://localhost:3000"
BUS_ROUTE = "210A"
BUS_ID = "abcde1230"

# Fixed bus position (stays still)
LAT = 12.9767
LON = 77.5732

# Next stop info
curr_stop_index = 0
next_stop_index = 1
next_stop_id = "S1"
next_stop_lat = 12.9719
next_stop_lon = 77.5813

POLLING_TIME = 10  # seconds


def post(url, payload):
    print(f"Sending POST to: {url}")
    try:
        res = requests.post(url, json=payload)
        data = res.json()
        print(f"Response: {data}")
        return data
    except Exception as e:
        print(f"HTTP request failed: {e}")
        return None


def poll():
    global curr_stop_index, next_stop_index, next_stop_id, next_stop_lat, next_stop_lon

    track_response = post(f"{SERVER_URL}/trackBus", {
        "busPositionLat": LAT,
        "busPositionLon": LON,
        "nextStopLat": next_stop_lat,
        "nextStopLon": next_stop_lon,
        "busID": BUS_ID,
        "nextStopId": next_stop_id,
        "routeNo": BUS_ROUTE,
        "crowdDensity": "LOW",
    })

    distance = track_response.get("distance", -1) if track_response else -1
    print(f"Distance from next stop: {distance}")

    if 0 < distance < 20:
        next_stop_response = post(f"{SERVER_URL}/getNextStop", {
            "routeNO": BUS_ROUTE,
            "currStopIndex": curr_stop_index,
            "nextStopIndex": next_stop_index,
        })

        if next_stop_response:
            curr_stop_index = next_stop_response.get("currStop", {}).get("index", curr_stop_index)
            next_stop_index = next_stop_response.get("nextStop", {}).get("index", next_stop_index)
            coords = next_stop_response.get("nextStop", {}).get("coordinates", [])
            next_stop_lat = coords[1] if len(coords) > 1 else next_stop_lat
            next_stop_lon = coords[0] if len(coords) > 0 else next_stop_lon
            next_stop_id = next_stop_response.get("nextStopId", next_stop_id)

            print("Updated to Next Stop:")
            print(f"  Curr Stop Index: {curr_stop_index}")
            print(f"  Next Stop Index: {next_stop_index}")


if __name__ == "__main__":
    print(f"Bus {BUS_ID} on route {BUS_ROUTE} — stationary at ({LAT}, {LON})")
    while True:
        poll()
        time.sleep(POLLING_TIME)