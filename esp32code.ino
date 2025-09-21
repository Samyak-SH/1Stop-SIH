#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi config
const char* ssid = "<your SSID>"; 
const char* password = "<your password>"; 
const char* serverURL = "<your server base url>";

WebServer server(80);

// Joystick Pins config
const int joyX = 34;   // VRx → GPIO34
const int joyY = 35;   // VRy → GPIO35
const int joySW = 25;  // SW  → GPIO25

// Bus Config
const char* busRoute = "210A";
const char* busId = "abcde1230";

unsigned short int currStopIndex = 0;
unsigned short int nextStopIndex = 1;

const char* nextStopId = "S1";

double startLat = 12.9767;
double startLon = 77.5732;

double lat = startLat;
double lon = startLon;
double nextStopLat = 12.9719;
double nextStopLon = 77.5813;

// Movement Config
const double FULL_TILT_KMPH = 100.0;
const double FULL_TILT_MPS = FULL_TILT_KMPH * 1000.0 / 3600.0;
const double EARTH_RADIUS = 6378137.0;

unsigned long lastUpdate = 0;

// Button debounce
bool lastButtonState = HIGH;
unsigned long lastButtonTime = 0;
const unsigned long debounceDelay = 200;

// Deadzone
const double DEADZONE = 0.30;

// Polling server interval
#define POLLING_TIME 10000 // every 10s
unsigned long lastPoll = 0;

// Helper fucntions
String getWiFiStatus(wl_status_t status) {
  switch (status) {
    case WL_IDLE_STATUS:   return "Idle";
    case WL_NO_SSID_AVAIL: return "SSID Not Found";
    case WL_SCAN_COMPLETED:return "Scan Completed";
    case WL_CONNECTED:     return "Connected";
    case WL_CONNECT_FAILED:return "Connection Failed";
    case WL_CONNECTION_LOST:return "Connection Lost";
    case WL_DISCONNECTED:  return "Disconnected";
    default:               return "Unknown Status";
  }
}

StaticJsonDocument<300> POST(String url, StaticJsonDocument<300> parsedPayload) {
  Serial.print("Sending POST req to: ");
  Serial.println(url);

  StaticJsonDocument<300> parsedResponse;
  String unparsedPayload, unparsedResponse;

  serializeJson(parsedPayload, unparsedPayload);

  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int response = http.POST(unparsedPayload);
  if (response > 0) {
    unparsedResponse = http.getString();
    Serial.println("Response: " + unparsedResponse);
  } else {
    Serial.println("Error in HTTP request");
  }

  DeserializationError error = deserializeJson(parsedResponse, unparsedResponse);
  if (error) {
    Serial.print("JSON parse fail: ");
    Serial.println(error.f_str());
  }
  http.end();
  return parsedResponse;
}

// Web Handlers 
void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>ESP32 Joystick Bus Tracker</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>html, body {height:100%; margin:0;} #map {height:100%;}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([%LAT%, %LON%], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var marker = L.marker([%LAT%, %LON%]).addTo(map);
    var poly = L.polyline([[ %LAT%, %LON% ]]).addTo(map);

    async function update() {
      let res = await fetch('/coords');
      let data = await res.json();
      marker.setLatLng([data.lat, data.lon]);
      poly.addLatLng([data.lat, data.lon]);
      map.panTo([data.lat, data.lon]);
    }
    setInterval(update, 500); 
  </script>
</body>
</html>
)rawliteral";

  html.replace("%LAT%", String(lat, 6));
  html.replace("%LON%", String(lon, 6));
  server.send(200, "text/html", html);
}

void handleCoords() {
  String json = "{";
  json += "\"lat\":" + String(lat, 6) + ",";
  json += "\"lon\":" + String(lon, 6);
  json += "}";
  server.send(200, "application/json", json);
}

// Setup 
void setup() {
  Serial.begin(115200);
  pinMode(joySW, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(": WiFi Status = ");
    Serial.println(getWiFiStatus(WiFi.status()));
  }

  Serial.println("\nConnected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/coords", handleCoords);
  server.begin();

  lastUpdate = millis();
  lastPoll = millis();
}

// Loop 
void loop() {
  server.handleClient();

  unsigned long now = millis();
  double dt = (now - lastUpdate) / 1000.0;
  if (dt <= 0) return;
  lastUpdate = now;

  // ---- Joystick ----
  int xRaw = analogRead(joyX);
  int yRaw = analogRead(joyY);
  int swVal = digitalRead(joySW);

  // Debounced reset
  if (swVal != lastButtonState) {
    lastButtonTime = now;
    lastButtonState = swVal;
  }
  if ((now - lastButtonTime) > debounceDelay && swVal == LOW) {
    lat = startLat;
    lon = startLon;
    Serial.println("Joystick button pressed → Reset to start position!");
  }

  // Normalize
  double x = (xRaw - 2048) / 2048.0;
  double y = (yRaw - 2048) / 2048.0;
  double mag = sqrt(x * x + y * y);
  if (mag > 1) mag = 1;

  if (mag >= DEADZONE) {
    double speed = FULL_TILT_MPS * mag;
    double dist = speed * dt;
    double nx = x / mag;
    double ny = y / mag;
    double north_m = ny * dist;
    double east_m = nx * dist;
    double dLat = (north_m / EARTH_RADIUS) * (180.0 / PI);
    double dLon = (east_m / (EARTH_RADIUS * cos(lat * PI / 180.0))) * (180.0 / PI);
    lat += dLat;
    lon += dLon;
    lat = constrain(lat, -90.0, 90.0);
    lon = constrain(lon, -180.0, 180.0);
  }

  // Polling Server 
  if (now - lastPoll >= POLLING_TIME) {
    lastPoll = now;

    if (WiFi.status() == WL_CONNECTED) {
      // POST /trackBus
      StaticJsonDocument<300> trackPayload;
      trackPayload["busPositionLat"] = lat;
      trackPayload["busPositionLon"] = lon;
      trackPayload["nextStopLat"] = nextStopLat;
      trackPayload["nextStopLon"] = nextStopLon;
      trackPayload["busID"] = busId;
      trackPayload["nextStopId"] = nextStopId;
      trackPayload["routeNo"] = busRoute;
      trackPayload["crowdDensity"] = "LOW";

      String trackUrl = String(serverURL) + "/trackBus";
      StaticJsonDocument<300> trackResponse = POST(trackUrl, trackPayload);

      int distance = trackResponse["distance"] | -1;
      Serial.print("Distance from next stop: ");
      Serial.println(distance);

      // If near stop, request next
      if (distance > 0 && distance < 20) {
        StaticJsonDocument<300> nextStopPayload;
        nextStopPayload["routeNO"] = busRoute;
        nextStopPayload["currStopIndex"] = currStopIndex;
        nextStopPayload["nextStopIndex"] = nextStopIndex;

        String nextStopUrl = String(serverURL) + "/getNextStop";
        StaticJsonDocument<300> nextStopResponse = POST(nextStopUrl, nextStopPayload);

        if (!nextStopResponse.isNull()) {
          currStopIndex = nextStopResponse["currStop"]["index"] | currStopIndex;
          nextStopIndex = nextStopResponse["nextStop"]["index"] | nextStopIndex;
          nextStopLat = nextStopResponse["nextStop"]["coordinates"][1] | nextStopLat;
          nextStopLon = nextStopResponse["nextStop"]["coordinates"][0] | nextStopLon;
          nextStopId = nextStopResponse["nextStopId"] | nextStopId;

          Serial.println("Updated to Next Stop:");
          Serial.printf("   Curr Stop Index: %d\n", currStopIndex);
          Serial.printf("   Next Stop Index: %d\n", nextStopIndex);
        }
      }
    }
  }
}
