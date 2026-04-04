"use client";

import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { MapPin, X, Loader2, Navigation, Map as MapIcon, Zap, Target, Check } from "lucide-react";
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
        
        if (window.google && window.google.maps) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
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
        className="flex items-center text-slate-400 text-[10px] sm:text-[11px] mt-0.5 cursor-pointer active:scale-95 transition-all hover:text-slate-900 group"
      >
        <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center mr-2 group-hover:bg-brand-green/20 transition-all border border-brand-green/10">
          <MapPin size={10} className="text-brand-green" />
        </div>
        <span className="uppercase tracking-widest font-black truncate max-w-[120px] italic text-slate-900/80">
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
            <motion.div 
              initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(255,255,255,0)" }}
              animate={{ backdropFilter: "blur(20px)", backgroundColor: "rgba(255,255,255,0.4)" }}
              exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(255,255,255,0)" }}
              onClick={() => setIsSearching(false)}
              className="absolute inset-0 cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(30,41,59,0.15)] p-10 space-y-10 overflow-hidden pointer-events-auto outline outline-8 outline-slate-50/50"
            >
              {/* Decorative Brand Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex justify-between items-center relative">
                <div className="space-y-1">
                  <h2 className="text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tighter italic flex items-center leading-none">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mr-4 border border-brand-green/20">
                       <Zap size={20} className="fill-brand-green" />
                    </div>
                    Select Hub
                  </h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] pl-14 leading-none">Explore India's premium fitness network</p>
                </div>
                <button 
                  onClick={() => setIsSearching(false)} 
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-sm active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 relative">
                {/* Geolocation Button */}
                <button 
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className={cn(
                    "w-full p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between group transition-all hover:bg-brand-green/5 hover:border-brand-green/20 shadow-sm",
                    isDetecting && "animate-pulse opacity-50"
                  )}
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl group-hover:bg-brand-green group-hover:shadow-brand-green/20 transition-all">
                      {isDetecting ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} className="fill-white" />}
                    </div>
                    <div className="text-left space-y-1">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Detect Current Location</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Instant GPS city identification</p>
                    </div>
                  </div>
                  <Check size={18} className="text-brand-green opacity-0 group-hover:opacity-100 transition-all" strokeWidth={4} />
                </button>

                <div className="flex items-center text-slate-100 space-x-6">
                  <div className="h-[1px] flex-1 bg-slate-50" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 leading-none">MANUAL SEARCH</span>
                  <div className="h-[1px] flex-1 bg-slate-50" />
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
                        placeholder="SEARCH YOUR CITY..."
                        className="w-full bg-white border border-slate-100 rounded-[2rem] py-8 pl-16 pr-8 text-lg font-black text-slate-900 outline-none focus:border-brand-green/30 transition-all shadow-sm placeholder:text-slate-200 uppercase tracking-widest"
                      />
                    </Autocomplete>
                  ) : (
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-8 flex items-center justify-center space-x-3 text-slate-300">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm font-bold uppercase tracking-widest italic">Loading Network...</span>
                    </div>
                  )}
                  <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors">
                     <MapIcon size={24} />
                  </div>
                </div>

                {error && (
                  <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse italic">{error}</p>
                )}
              </div>

              <div className="space-y-6 relative">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 outline-none">Rapid Selection</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Indore", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad"].map((city) => (
                    <button 
                      key={city}
                      onClick={() => {
                        setLocationName(`${city}`);
                        setIsSearching(false);
                        onLocationSelect(`${city}`, 22.7196, 75.8577);
                      }}
                      className="p-6 rounded-2xl bg-white border border-slate-100 text-left text-slate-400 font-black text-[10px] hover:border-brand-green hover:bg-brand-green/5 hover:text-slate-900 transition-all uppercase tracking-widest shadow-sm flex items-center justify-between group"
                    >
                      <span>{city}</span>
                      <div className="w-5 h-5 rounded-lg bg-slate-50 group-hover:bg-brand-green group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight size={10} strokeWidth={4} className="" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 text-center">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] italic leading-none">Select a city to unlock premium hubs near you</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const ArrowRight = ({ size, className, strokeWidth = 2 }: { size: number, className: string, strokeWidth?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
