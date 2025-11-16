import React, { useState, useRef, useEffect } from 'react';
import { Coordinates } from '../types';

// Dichiarazione di 'google' a livello globale per evitare errori TypeScript
declare global {
  interface Window {
    google: any;
  }
}

interface MapPickerProps {
  coordinates: Coordinates | null;
  onCoordinatesChange: (coords: Coordinates) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ coordinates, onCoordinatesChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // FIX: Replaced google.maps.Map with any to avoid namespace error.
  const [map, setMap] = useState<any | null>(null);
  // FIX: Replaced google.maps.Marker with any to avoid namespace error.
  const [marker, setMarker] = useState<any | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    // Controlla periodicamente se l'API di Google Maps è stata caricata
    const checkApi = () => {
      if (window.google && window.google.maps) {
        setIsApiLoaded(true);
      } else {
        setTimeout(checkApi, 100);
      }
    };
    checkApi();
  }, []);

  // Inizializza la mappa
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || map) return;

    const initialCenter = { lat: 41.902782, lng: 12.496366 }; // Default: Roma

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
    });

    // FIX: Replaced google.maps.MapMouseEvent with any to avoid namespace error.
    mapInstance.addListener('click', (e: any) => {
      if (e.latLng) {
        onCoordinatesChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });

    setMap(mapInstance);
  }, [isApiLoaded, map, onCoordinatesChange]);

  // Gestisce il marcatore sulla mappa
  useEffect(() => {
    if (!map) return;

    if (!marker) {
      const newMarker = new window.google.maps.Marker({ map, draggable: true });
      // FIX: Replaced google.maps.MapMouseEvent with any to avoid namespace error.
      newMarker.addListener('dragend', (e: any) => {
        if (e.latLng) {
          onCoordinatesChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
      });
      setMarker(newMarker);
    } else {
      if (coordinates) {
        marker.setPosition(coordinates);
        marker.setMap(map);
        map.panTo(coordinates);
      } else {
        marker.setMap(null);
      }
    }
  }, [map, marker, coordinates, onCoordinatesChange]);

  // Inizializza la casella di ricerca
  useEffect(() => {
    if (!map || !searchInputRef.current) return;

    const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
    const listener = searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;
      
      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }
      onCoordinatesChange({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    }
  }, [map, onCoordinatesChange]);
  
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onCoordinatesChange(coords);
          if (map) {
            map.setCenter(coords);
            map.setZoom(15);
          }
        },
        () => {
          alert('Error: The Geolocation service failed. Please ensure location permissions are granted.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  if (!isApiLoaded) {
    return (
      <div className="mt-2">
        <p className="text-sm font-medium text-stone-700">Geolocation (Mandatory)</p>
        <div className="relative w-full h-[350px] bg-stone-200 rounded-md flex items-center justify-center animate-pulse">
            <p className="text-stone-500">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="text-sm font-medium text-stone-700">Geolocation (Mandatory)</p>
      <p className="text-xs text-stone-500 mb-2">Search for a place or click on the map to set the location.</p>
      
      <div className="relative mb-2">
        <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
        />
        <button 
          type="button" 
          onClick={handleGeolocate} 
          className="absolute top-1/2 right-2 -translate-y-1/2 text-stone-400 hover:text-amber-600 p-1" 
          title="Use my current location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C.458 4.737 4.737.458 10 .458c5.263 0 9.542 4.279 9.542 9.542 0 5.263-4.279 9.542-9.542 9.542C4.737 19.542.458 15.263.458 10zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div
        ref={mapRef}
        className="w-full h-[350px] bg-stone-200 rounded-md"
      />

      <div className="mt-2 text-xs text-stone-600 bg-stone-100 p-2 rounded-md">
        {coordinates ? (
          `Lat: ${coordinates.lat.toFixed(6)}, Lng: ${coordinates.lng.toFixed(6)}`
        ) : (
          "No location selected."
        )}
      </div>
    </div>
  );
};

export default MapPicker;