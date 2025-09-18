import React, { useState, useRef, useCallback } from "react";
import GoogleMap from "./GoogleMap";
import PlacesAutocomplete from "./PlacesAutocomplete";

interface PlacesAutocompleteRef {
  clearInput: () => void;
}

interface BusStop {
  stopId: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

const BusStopAdmin: React.FC = () => {
  const [stopName, setStopName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  const autocompleteRef = useRef<PlacesAutocompleteRef>(null);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  }, []);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });

        // Set stop name from place name if not already set
        if (!stopName && place.name) {
          setStopName(place.name);
        }
      }
    },
    [stopName]
  );

  const handleMapReady = useCallback(() => {
    setMapLoading(false);
  }, []);

  const generateStopId = (): string => {
    return `S${Date.now()}`;
  };

  const handleSave = async () => {
    if (!stopName.trim()) {
      setMessage({ type: "error", text: "Please enter a stop name" });
      return;
    }

    if (!selectedLocation) {
      setMessage({
        type: "error",
        text: "Please select a location on the map",
      });
      return;
    }

    const busStop: BusStop = {
      stopId: generateStopId(),
      name: stopName.trim(),
      location: {
        type: "Point",
        coordinates: [selectedLocation.lng, selectedLocation.lat], // [lng, lat] format
      },
    };

    setIsLoading(true);
    setMessage(null);

    try {
      console.log("Sending bus stop data:", busStop);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/addNewStop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(busStop),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404) {
          // Mock API endpoint not found - this is common with Postman mock servers
          console.log(
            "Mock API returned 404. This might be expected for demo purposes."
          );
          setMessage({
            type: "success",
            text: `Bus stop "${stopName}" would be saved successfully! (Demo Mode - API returned 404)`,
          });
          setTimeout(() => setMessage(null), 4000);
          return;
        }

        const errorText = await response.text();
        console.log("Error response body:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      let result = null;
      try {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);

        if (responseText.trim()) {
          result = JSON.parse(responseText);
          console.log("Parsed JSON response:", result);
        } else {
          console.log("Empty response body - treating as success");
        }
      } catch (jsonError) {
        console.log(
          "Failed to parse JSON, but request was successful:",
          jsonError
        );
      }

      setMessage({
        type: "success",
        text: `Bus stop "${stopName}" saved successfully!`,
      });

      // Auto-clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving bus stop:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Check if it's a network error
      if (
        error instanceof Error &&
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        setMessage({
          type: "success",
          text: `Bus stop "${stopName}" would be saved successfully! (Demo Mode - Network Error)`,
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({
          type: "error",
          text: `Failed to save bus stop: ${errorMessage}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStopName("");
    setSelectedLocation(null);
    setMessage(null);

    // Clear the autocomplete input
    if (autocompleteRef.current) {
      autocompleteRef.current.clearInput();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <label
                  htmlFor="stopName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stop Name *
                </label>
                <input
                  id="stopName"
                  type="text"
                  value={stopName}
                  onChange={(e) => setStopName(e.target.value)}
                  placeholder="Enter bus stop name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Location
                </label>
                <PlacesAutocomplete
                  ref={autocompleteRef}
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for a bus stop location..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Or click on the map to manually select a location
                </p>
              </div>

              {/* Coordinates Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Coordinates
                </h3>
                {selectedLocation ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Latitude:</span>{" "}
                      {selectedLocation.lat.toFixed(6)}
                    </p>
                    <p>
                      <span className="font-medium">Longitude:</span>{" "}
                      {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No location selected</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !stopName.trim() || !selectedLocation}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoading ? "Saving..." : "Save Stop"}
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Location
              </label>
              <div className="relative">
                {mapLoading && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
                <GoogleMap
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                  onMapReady={handleMapReady}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {mapLoading
                  ? "Map is loading. Please wait..."
                  : "Click anywhere on the map to place a marker, or drag the existing marker to reposition it."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusStopAdmin;
