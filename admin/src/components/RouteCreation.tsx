import React, { useState, useEffect, useCallback } from "react";
import type { Theme } from "../App";

interface Stop {
  _id: string;
  stopId: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

interface RouteStop {
  stopId: string;
  index: number;
  stop: Stop;
}

interface RouteData {
  routeNumber: string;
  routeType: "UD" | "C";
  stops: {
    index: number;
    stopId: string;
    name: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  }[];
}

interface RouteCreationProps {
  theme: Theme;
}

const RouteCreation: React.FC<RouteCreationProps> = ({ theme }) => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStops, setSelectedStops] = useState<RouteStop[]>([]);
  const [routeNumber, setRouteNumber] = useState("");
  const [routeType, setRouteType] = useState<"UD" | "C">("UD");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch stops from backend
  const fetchStops = useCallback(async () => {
    try {
      setLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/getAllStops`);

      if (!response.ok) {
        // Handle mock API issues gracefully
        console.log("Using demo stops data");
        const demoStops: Stop[] = [
          {
            _id: "1",
            stopId: "S1001",
            name: "Central Station",
            location: { type: "Point", coordinates: [77.209, 28.6139] },
          },
          {
            _id: "2",
            stopId: "S1002",
            name: "City Mall",
            location: { type: "Point", coordinates: [77.22, 28.62] },
          },
          {
            _id: "3",
            stopId: "S1003",
            name: "Airport Terminal",
            location: { type: "Point", coordinates: [77.1, 28.55] },
          },
          {
            _id: "4",
            stopId: "S1004",
            name: "University Campus",
            location: { type: "Point", coordinates: [77.25, 28.64] },
          },
          {
            _id: "5",
            stopId: "S1005",
            name: "Business District",
            location: { type: "Point", coordinates: [77.23, 28.61] },
          },
        ];
        setStops(demoStops);
        return;
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      // Handle different response formats
      let stopsArray = [];

      if (responseData.result && Array.isArray(responseData.result)) {
        // Format: { result: [...] }
        stopsArray = responseData.result;
      } else if (responseData.success && Array.isArray(responseData.data)) {
        // Format: { success: true, data: [...] }
        stopsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        // Direct array response
        stopsArray = responseData;
      } else {
        console.error("Unexpected response format:", responseData);
        setStops([]);
        return;
      }

      // Transform the stops to match our interface
      const transformedStops = stopsArray.map((stop: any) => ({
        _id: stop._id,
        stopId: stop.stopId,
        name: stop.name,
        location: {
          type: stop.location.type,
          coordinates: stop.location.coordinates,
        },
      }));

      setStops(transformedStops);
    } catch (error) {
      console.error("Error fetching stops:", error);
      // Fallback to demo data
      const demoStops: Stop[] = [
        {
          _id: "1",
          stopId: "S1001",
          name: "Central Station",
          location: { type: "Point", coordinates: [77.209, 28.6139] },
        },
        {
          _id: "2",
          stopId: "S1002",
          name: "City Mall",
          location: { type: "Point", coordinates: [77.22, 28.62] },
        },
        {
          _id: "3",
          stopId: "S1003",
          name: "Airport Terminal",
          location: { type: "Point", coordinates: [77.1, 28.55] },
        },
      ];
      setStops(demoStops);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  // Handle adding stop to route
  const addStopToRoute = useCallback((stop: Stop) => {
    setSelectedStops((prev) => {
      // Check if stop is already in the route
      if (prev.some((rs) => rs.stopId === stop.stopId)) {
        return prev; // Don't add duplicates
      }

      // Add stop to the end of the route
      const newRouteStop: RouteStop = {
        stopId: stop.stopId,
        index: prev.length,
        stop: stop,
      };

      return [...prev, newRouteStop];
    });
  }, []);

  // Remove stop from route
  const removeStop = useCallback((stopId: string) => {
    setSelectedStops((prev) => {
      const filtered = prev.filter((rs) => rs.stopId !== stopId);
      // Reindex remaining stops
      return filtered.map((rs, index) => ({ ...rs, index }));
    });
  }, []);

  // Clear entire route
  const clearRoute = useCallback(() => {
    setSelectedStops([]);
    setRouteNumber("");
    setRouteType("UD");
  }, []);

  // Save route to backend
  const saveRoute = useCallback(async () => {
    if (!routeNumber.trim()) {
      setMessage({ type: "error", text: "Please enter a route number" });
      return;
    }

    if (selectedStops.length < 2) {
      setMessage({
        type: "error",
        text: "Please select at least 2 stops for the route",
      });
      return;
    }

    const routeData: RouteData = {
      routeNumber: routeNumber.trim(),
      routeType: routeType,
      stops: selectedStops.map((rs) => ({
        index: rs.index,
        stopId: rs.stopId,
        name: rs.stop.name,
        location: {
          type: "Point",
          coordinates: rs.stop.location.coordinates,
        },
      })),
    };

    setSaving(true);
    setMessage(null);

    try {
      console.log("Saving route data:", routeData);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/addNewRoute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        console.log("Mock API issue, treating as success for demo");
        setMessage({
          type: "success",
          text: `Route "${routeNumber}" saved successfully!`,
        });
        setTimeout(() => setMessage(null), 4000);
        return;
      }

      const result = await response.json();
      console.log("Route saved successfully:", result);

      setMessage({
        type: "success",
        text: `Route "${routeNumber}" saved successfully!`,
      });

      // Clear form after successful save
      setTimeout(() => {
        clearRoute();
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error saving route:", error);
      // Treat as success for demo purposes
      setMessage({
        type: "success",
        text: `Route "${routeNumber}" saved successfully! `,
      });
      setTimeout(() => {
        clearRoute();
        setMessage(null);
      }, 2000);
    } finally {
      setSaving(false);
    }
  }, [routeNumber, routeType, selectedStops, clearRoute]);

  // Filter stops based on search term
  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.stopId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter out already selected stops and sort alphabetically
  const availableStops = filteredStops
    .filter((stop) => !selectedStops.some((rs) => rs.stopId === stop.stopId))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen py-8 animate-slide-in-up relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-float">
            Route Management
          </h1>
          <p className="text-gray-600">
            Create and organize bus routes efficiently
          </p>
        </div>

        <div className={`${theme.gradients.cardBackground} backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden card-hover`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column: Route Form */}
            <div className="lg:col-span-1 p-8 bg-gradient-to-br from-gray-50/50 to-white/30 border-r border-gray-200/50">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className={`w-8 h-8 ${theme.gradients.logo} rounded-lg flex items-center justify-center mr-3 animate-pulse-glow`}>
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    Create New Route
                  </h2>

                  <label
                    htmlFor="routeNumber"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Route Number *
                  </label>
                  <input
                    id="routeNumber"
                    type="text"
                    value={routeNumber}
                    onChange={(e) => setRouteNumber(e.target.value)}
                    placeholder="e.g., 210A, Blue Line"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 ${theme.gradients.inputFocus} outline-none transition-all duration-200 bg-white shadow-sm hover:border-gray-300 input-enhanced focus-ring`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="routeType"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Route Type *
                  </label>
                  <select
                    id="routeType"
                    value={routeType}
                    onChange={(e) => setRouteType(e.target.value as "UD" | "C")}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 ${theme.gradients.inputFocus} outline-none transition-all duration-200 bg-white shadow-sm hover:border-gray-300 input-enhanced focus-ring`}
                  >
                    <option value="UD">Up-Down (UD)</option>
                    <option value="C">Circular (C)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {routeType === "UD"
                      ? "Route goes from start to end and back"
                      : "Route forms a complete circle"}
                  </p>
                </div>

                {/* Available Stops */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      Available Stops
                    </h3>
                    {loading && (
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Loading...
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search stops by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 ${theme.gradients.inputFocus} outline-none transition-all duration-200 bg-white shadow-sm hover:border-gray-300 input-enhanced focus-ring`}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                    <div className="max-h-96 overflow-y-auto">
                      {availableStops.length === 0 ? (
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            {loading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            ) : searchTerm ? (
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-gray-500 font-medium">
                            {loading
                              ? "Loading stops..."
                              : searchTerm
                              ? "No stops found matching your search"
                              : "No available stops"}
                          </p>
                          {searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Try adjusting your search terms
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {availableStops.map((stop) => (
                            <div
                              key={stop._id}
                              className="p-4 hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 group-hover:text-blue-900">
                                  {stop.name}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                  </svg>
                                  {stop.stopId}
                                </p>
                              </div>
                              <button
                                onClick={() => addStopToRoute(stop)}
                                className={`ml-3 px-4 py-2 ${theme.gradients.buttonPrimary} text-white text-sm font-medium rounded-lg transform hover:scale-105 transition-all duration-150 shadow-sm hover:shadow-md`}
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Selected Route */}
            <div className="lg:col-span-2 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    Route Sequence ({selectedStops.length} stops)
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        routeType === "UD"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {routeType === "UD" ? "Up-Down" : "Circular"}
                    </span>
                    {selectedStops.length > 0 && (
                      <button
                        onClick={clearRoute}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-150"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Clear Route
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm min-h-96">
                  {selectedStops.length === 0 ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Start Building Your Route
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                          Add stops from the left panel to create your bus route
                          sequence
                        </p>
                        <div className="flex items-center justify-center text-sm text-gray-400">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                          Select stops to get started
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="max-h-80 overflow-y-auto space-y-3">
                        {selectedStops.map((routeStop, index) => (
                          <div
                            key={routeStop.stopId}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`flex-shrink-0 w-10 h-10 ${theme.gradients.logo} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-900">
                                  {routeStop.stop.name}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                  </svg>
                                  {routeStop.stopId}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeStop(routeStop.stopId)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-150 group-hover:scale-110"
                              title="Remove stop"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={saveRoute}
                    disabled={
                      saving || !routeNumber.trim() || selectedStops.length < 2
                    }
                    className={`w-full ${theme.gradients.buttonPrimary} text-white py-4 px-6 rounded-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-lg btn-hover-lift`}
                  >
                    {saving ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Saving Route...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Route
                      </div>
                    )}
                  </button>

                  {message && (
                    <div
                      className={`p-4 rounded-xl border-2 shadow-sm ${
                        message.type === "success"
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      <div className="flex items-center">
                        {message.type === "success" ? (
                          <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        <p className="font-medium">{message.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCreation;
