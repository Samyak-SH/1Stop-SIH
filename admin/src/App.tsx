import React, { useState } from "react";
import BusStopAdmin from "./components/BusStopAdmin";
import RouteCreation from "./components/RouteCreation";

type Page = "bus-stops" | "routes";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("bus-stops");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">
                Transit Admin Panel
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage("bus-stops")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "bus-stops"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Bus Stops
                </button>
                <button
                  onClick={() => setCurrentPage("routes")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "routes"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Route Creation
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="min-h-[calc(100vh-64px)]">
        {currentPage === "bus-stops" && <BusStopAdmin />}
        {currentPage === "routes" && <RouteCreation />}
      </div>
    </div>
  );
}

export default App;
