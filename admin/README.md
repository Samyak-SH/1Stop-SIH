# Bus Stop Admin Panel

A React + TypeScript + Vite application for managing bus stops with Google Maps integration.

## Features

- 🗺️ Interactive Google Maps with click-to-pin functionality
- 🔍 Google Places Autocomplete for location search
- 📍 Draggable markers for precise positioning
- 💾 Save bus stops to backend API
- 🧹 Reset functionality to clear form and markers
- 📱 Responsive design with TailwindCSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Maps API

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
3. Create a `.env` file in the project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Backend API

The application is configured to use a mock API endpoint at:

`https://a237fb13-bd0b-4a5a-a012-6b6a3b2f8aba.mock.pstmn.io`

**POST** `/api/stops`

Expected request body:

```json
{
  "stopId": "S1694889234567",
  "name": "Central Bus Station",
  "location": {
    "type": "Point",
    "coordinates": [77.209, 28.6139]
  }
}
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Search for a location**: Use the search input to find places using Google Places Autocomplete
2. **Manual pin placement**: Click anywhere on the map to place a marker
3. **Adjust location**: Drag the marker to fine-tune the position
4. **Enter stop name**: Fill in the bus stop name in the text field
5. **View coordinates**: See the live latitude and longitude values
6. **Save**: Click "Save Stop" to send data to the backend
7. **Reset**: Click "Reset" to clear the form and remove markers

## Project Structure

```
src/
├── components/
│   ├── BusStopAdmin.tsx      # Main admin component
│   ├── GoogleMap.tsx         # Google Maps integration
│   └── PlacesAutocomplete.tsx # Places search component
├── App.tsx                   # App entry point
└── index.css                 # TailwindCSS styles
```

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Google Maps JavaScript API** for maps
- **Google Places API** for location search
- **@googlemaps/js-api-loader** for API loading

## API Schema

The application sends bus stop data in the following format:

```typescript
interface BusStop {
  stopId: string; // Format: "S" + timestamp
  name: string; // User-entered stop name
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}
```

## Environment Variables

| Variable                   | Description         | Required |
| -------------------------- | ------------------- | -------- |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes      |

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

1. **Maps not loading**: Check your Google Maps API key and ensure the Maps JavaScript API is enabled
2. **Autocomplete not working**: Ensure the Places API is enabled in your Google Cloud Console
3. **Save failing**: Verify your internet connection and that the mock API endpoint is accessible
