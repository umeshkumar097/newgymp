"use client";

import React, { useState, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, X, Loader2 } from "lucide-react";

import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";

interface LocationSearchProps {
  initialLocation?: string;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
}

export function LocationSearch({ initialLocation = "Indore, MP", onLocationSelect }: LocationSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [locationName, setLocationName] = useState(initialLocation);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useGoogleMaps();

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const name = place.formatted_address || place.name || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setLocationName(name);
        onLocationSelect(name, lat, lng);
        setIsSearching(false);
      }
    }
  };

  if (isSearching) {
    return (
      <div className="fixed inset-0 z-[110] bg-zinc-950 p-6 space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-outfit text-white">Select Location</h2>
          <button onClick={() => setIsSearching(false)} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          {isLoaded ? (
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} options={{ types: ["(cities)"], componentRestrictions: { country: "in" } }}>
              <input
                type="text"
                autoFocus
                placeholder="Search for your city or area..."
                className="w-full bg-zinc-900 border border-orange-500/30 rounded-2xl py-5 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-orange-500 transition-all shadow-2xl placeholder:opacity-30"
              />
            </Autocomplete>
          ) : (
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 flex items-center justify-center space-x-3 text-zinc-500">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Loading Maps...</span>
            </div>
          )}
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Popular Cities</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Indore", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad"].map((city) => (
              <button 
                key={city}
                onClick={() => {
                  setLocationName(`${city}, India`);
                  setIsSearching(false);
                  // In a real app, we'd fetch coordinates for these or just set the name
                  onLocationSelect(`${city}, India`, 0, 0); 
                }}
                className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-left text-zinc-400 font-bold text-xs hover:border-orange-500/50 hover:text-white transition-all uppercase tracking-tight"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsSearching(true)}
      className="flex items-center text-zinc-400 text-[10px] mt-0.5 cursor-pointer active:scale-95 transition-transform"
    >
      <MapPin size={12} className="mr-1 text-orange-500" />
      <span className="uppercase tracking-wider font-semibold truncate max-w-[120px]">
        {locationName}
      </span>
    </div>
  );
}
