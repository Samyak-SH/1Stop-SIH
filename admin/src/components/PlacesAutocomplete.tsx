import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

interface PlacesAutocompleteRef {
  clearInput: () => void;
}

const PlacesAutocomplete = forwardRef<
  PlacesAutocompleteRef,
  PlacesAutocompleteProps
>(
  (
    {
      onPlaceSelect,
      placeholder = "Search for a bus stop location...",
      className = "",
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
      null
    );

    useEffect(() => {
      if (!inputRef.current || !window.google?.maps?.places?.Autocomplete)
        return;

      // Initialize autocomplete
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["establishment", "geocode"],
          fields: ["place_id", "geometry", "name", "formatted_address"],
        }
      );

      autocompleteRef.current = autocomplete;

      // Add place changed listener
      const listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          onPlaceSelect(place);
        }
      });

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    }, [onPlaceSelect]);

    const clearInput = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    useImperativeHandle(ref, () => ({
      clearInput,
    }));

    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${className}`}
        />
      </div>
    );
  }
);

PlacesAutocomplete.displayName = "PlacesAutocomplete";

export default PlacesAutocomplete;
