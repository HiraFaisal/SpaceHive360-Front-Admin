"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  GoogleMap, 
  useJsApiLoader, 
  MarkerF, 
  Autocomplete,
  Libraries
} from "@react-google-maps/api";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Add specific libraries needed
const libraries: Libraries = ["places"];

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string, city?: string) => void;
  initialLocation?: [number, number];
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: libraries,
    language: "en",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(
    initialLocation ? { lat: initialLocation[0], lng: initialLocation[1] } : null
  );
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Update map when initialLocation changes (e.g. switching between locations)
  useEffect(() => {
    if (initialLocation) {
        const newPos = { lat: initialLocation[0], lng: initialLocation[1] };
        setMarkerPosition(newPos);
        if (map) {
            map.panTo(newPos);
            map.setZoom(16);
        }
        
        // Optionally reverse geocode to update the search input too
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newPos }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                setSearchQuery(results[0].formatted_address);
            }
        });
    } else {
        setMarkerPosition(null);
        setSearchQuery("");
    }
  }, [initialLocation, map]);

  const extractCity = (addressComponents: google.maps.GeocoderAddressComponent[]) => {
    const city = addressComponents.find(
      (comp) => 
        comp.types.includes("locality") || 
        comp.types.includes("administrative_area_level_2")
    );
    return city ? city.long_name : "";
  };

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        const city = extractCity(results[0].address_components);
        setMarkerPosition({ lat, lng });
        setSearchQuery(address);
        onLocationSelect(lat, lng, address, city);
      } else {
        onLocationSelect(lat, lng);
      }
    });
  }, [onLocationSelect]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationChange(lat, lng);
    }
  }, [handleLocationChange]);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationChange(lat, lng);
    }
  }, [handleLocationChange]);

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";
        const city = extractCity(place.address_components || []);

        setMarkerPosition({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(16);
        }
        setSearchQuery(address);
        onLocationSelect(lat, lng, address, city);
      }
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
        setIsSearching(false);
        if (status === "OK" && results && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            const address = results[0].formatted_address;
            const city = extractCity(results[0].address_components);

            const nLat = lat();
            const nLng = lng();

            setMarkerPosition({ lat: nLat, lng: nLng });
            if (map) {
                map.panTo({ lat: nLat, lng: nLng });
                map.setZoom(16);
            }
            setSearchQuery(address);
            onLocationSelect(nLat, nLng, address, city);
        } else {
            alert("Location not found. Please try a more specific address.");
        }
    });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationChange(latitude, longitude);
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(16);
          }
          setIsSearching(false);
        },
        () => {
          setIsSearching(false);
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  if (loadError) return <div className="p-4 text-destructive border rounded-lg bg-destructive/10 text-xs font-bold uppercase tracking-widest">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse"><Loader2 className="size-6 animate-spin text-primary/40" /></div>;

  return (
    <div className="space-y-3">
      {/* Global CSS for Autocomplete Dropdown - Fixes visibility and click issues in Radix Sheets */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pac-container {
          z-index: 9999 !important;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          font-family: inherit;
          pointer-events: auto !important;
        }
        .pac-item {
          padding: 10px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .pac-item:hover {
          background-color: #f8fafc;
        }
        .pac-item-query {
          font-size: 14px;
          color: #1e293b;
        }
        .pac-matched {
          font-weight: 700;
        }
      `}} />

      <div className="flex gap-2 bg-card p-2 rounded-lg border shadow-sm items-center">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Autocomplete
          onLoad={(auto) => setAutocomplete(auto)}
          onPlaceChanged={onPlaceSelected}
          className="flex-1"
        >
          <Input 
              placeholder="Search address (e.g. 123 Main St, New York)" 
              className="border-none shadow-none focus-visible:ring-0 w-full bg-transparent h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
          />
        </Autocomplete>
        <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <Button 
                type="button" 
                variant="ghost"
                size="icon"
                onClick={useCurrentLocation}
                disabled={isSearching}
                title="Use Current Location"
                className="h-9 w-9 rounded-md text-primary hover:bg-primary/5"
            >
                <Navigation className="size-4" />
            </Button>
            <div className="h-6 w-px bg-border/50 mx-0.5" />
            <Button 
                type="button" 
                variant="default"
                onClick={handleManualSearch}
                disabled={isSearching}
                className="h-9 px-4 text-xs font-semibold rounded-md"
            >
                {isSearching ? <Loader2 className="size-3 animate-spin" /> : "Find"}
            </Button>
        </div>
      </div>

      <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-sm relative group">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || defaultCenter}
          zoom={initialLocation ? 16 : 13}
          onLoad={(map) => setMap(map)}
          onClick={onMapClick}
          options={mapOptions}
        >
          {markerPosition && (
            <MarkerF
              position={markerPosition}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
              animation={google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
        
        <div className="absolute bottom-4 left-4 z-[10] bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-xl flex items-center gap-2 pointer-events-none transition-all group-hover:scale-105">
            <MapPin className="size-3 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80">
                {markerPosition ? `${markerPosition.lat.toFixed(5)}, ${markerPosition.lng.toFixed(5)}` : "Select Location"}
            </span>
        </div>

        <div className="absolute top-4 right-4 z-[10] bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-bold text-muted-foreground/60 border border-border/40">
            Powered by Google Maps
        </div>
      </div>
    </div>
  );
}
