"use client";

import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { MapPin, X, Loader2, Navigation, Map as MapIcon, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import { cn } from "@/lib/utils";

interface LocationSearchProps {
  initialLocation?: string;
  onLocationSelect: (location: string, lat: number, lng: number) => void;
}

export function LocationSearch({ initialLocation = "Indore, MP", onLocationSelect }: LocationSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationName, setLocationName] = useState(initialLocation);
  const [error, setError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useGoogleMaps();

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse Geocoding via Google Maps
        if (window.google && window.google.maps) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              // Try to find the city specifically
              const cityComponent = results[0].address_components.find(c => 
                c.types.includes("locality") || c.types.includes("administrative_area_level_2")
              );
              const cityName = cityComponent ? cityComponent.long_name : address.split(",")[0];
              
              setLocationName(cityName);
              onLocationSelect(cityName, latitude, longitude);
              setIsSearching(false);
            } else {
              setError("Could not resolve address");
            }
            setIsDetecting(false);
          });
        }
      },
      (err) => {
        console.error("Geolocation Error:", err);
        setError("Location access denied");
        setIsDetecting(false);
      }
    );
  };

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

  return (
    <>
      <div 
        onClick={() => setIsSearching(true)}
        className="flex items-center text-zinc-400 text-[10px] sm:text-[11px] mt-0.5 cursor-pointer active:scale-95 transition-all hover:text-white group"
      >
        <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center mr-2 group-hover:bg-orange-500/20 transition-all">
          <MapPin size={10} className="text-orange-500" />
        </div>
        <span className="uppercase tracking-widest font-black truncate max-w-[120px] italic">
          {locationName}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-start justify-center p-4 sm:p-10"
          >
            {/* Glassmorphism Backdrop */}
            <motion.div 
              initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
              animate={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.8)" }}
              exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
              onClick={() => setIsSearching(false)}
              className="absolute inset-0 cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/5 rounded-[2.5rem] shadow-2xl p-8 space-y-8 overflow-hidden pointer-events-auto"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex justify-between items-center relative">
                <div className="space-y-1">
                  <h2 className="text-3xl font-extrabold font-outfit text-white uppercase tracking-tighter italic flex items-center">
                    <Target className="mr-3 text-orange-500" size={24} />
                    Select Hub
                  </h2>
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Explore premium fitness in your city</p>
                </div>
                <button 
                  onClick={() => setIsSearching(false)} 
                  className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-lg active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 relative">
                {/* Geolocation Button */}
                <button 
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className={cn(
                    "w-full p-6 rounded-[1.5rem] bg-orange-500/5 border border-orange-500/20 flex items-center justify-between group transition-all hover:bg-orange-500/10",
                    isDetecting && "animate-pulse opacity-50"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                      {isDetecting ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} className="fill-white" />}
                    </div>
                    <div className="text-left">
                       <h3 className="text-xs font-black text-white uppercase tracking-widest">Detect Current Location</h3>
                       <p className="text-[10px] font-bold text-orange-500/70 uppercase">Automatic high-precision detection</p>
                    </div>
                  </div>
                  <Zap size={14} className="text-orange-500 group-hover:scale-125 transition-transform" />
                </button>

                <div className="flex items-center text-zinc-800 space-x-4">
                  <div className="h-[1px] flex-1 bg-zinc-900" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">OR SEARCH MANUALLY</span>
                  <div className="h-[1px] flex-1 bg-zinc-900" />
                </div>

                <div className="relative group">
                  {isLoaded ? (
                    <Autocomplete 
                      onLoad={onLoad} 
                      onPlaceChanged={onPlaceChanged} 
                      options={{ types: ["(cities)"], componentRestrictions: { country: "in" } }}
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder="ENTER CITY OR AREA..."
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-[1.5rem] py-8 pl-14 pr-6 text-white text-md font-extrabold focus:outline-none focus:border-orange-500 transition-all shadow-2xl placeholder:text-zinc-700 uppercase tracking-widest"
                      />
                    </Autocomplete>
                  ) : (
                    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-5 flex items-center justify-center space-x-3 text-zinc-500">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm font-bold uppercase tracking-widest">Loading Maps...</span>
                    </div>
                  )}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500">
                     <MapIcon size={20} />
                  </div>
                </div>

                {error && (
                  <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>
                )}
              </div>

              <div className="space-y-4 relative">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-2 outline-none">Popular Cities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Indore", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad"].map((city) => (
                    <button 
                      key={city}
                      onClick={() => {
                        setLocationName(`${city}`);
                        setIsSearching(false);
                        onLocationSelect(`${city}`, 22.7196, 75.8577); // Simplified Indore coords as base
                      }}
                      className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 text-left text-zinc-500 font-black text-[10px] hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all uppercase tracking-[0.1em] shadow-sm flex items-center justify-between group"
                    >
                      <span>{city}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pro Tip Button */}
              <div className="pt-2 text-center">
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Select a city to filter premium hubs near you</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const ArrowRight = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
