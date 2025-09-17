import React, { useEffect, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  onMapReady: (map: google.maps.Map) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  onLocationSelect,
  selectedLocation,
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current) {
      console.log("Map ref not ready yet");
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error(
        "Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables."
      );
      return;
    }

    try {
      const loader = new Loader({
        apiKey,
        version: "weekly",
        libraries: ["places"],
      });

      await loader.load();

      // Double check that the ref is still available after async load
      if (!mapRef.current) {
        console.error("Map ref became null during Google Maps loading");
        return;
      }

      // Default center (you can change this to your preferred location)
      const defaultCenter = { lat: 28.6139, lng: 77.209 }; // New Delhi

      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
      onMapReady(map);

      // Add click listener to map
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          onLocationSelect(lat, lng);
        }
      });
    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  }, [onLocationSelect, onMapReady]);

  const updateMarker = useCallback(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    const marker = new google.maps.Marker({
      position: selectedLocation,
      map: mapInstanceRef.current,
      title: "Selected Bus Stop Location",
      draggable: true,
    });

    // Add drag listener to marker
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (position) {
        onLocationSelect(position.lat(), position.lng());
      }
    });

    markerRef.current = marker;

    // Center map on marker
    mapInstanceRef.current.setCenter(selectedLocation);
  }, [selectedLocation, onLocationSelect]);

  const clearMarker = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeMap]);

  useEffect(() => {
    if (selectedLocation) {
      updateMarker();
    } else {
      clearMarker();
    }
  }, [selectedLocation, updateMarker, clearMarker]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[70vh] rounded-lg border border-gray-300 shadow-md"
      style={{ minHeight: "500px" }}
    />
  );
};

export default GoogleMap;
