"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import { Star, MapPin, ChevronRight } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

interface GymMapProps {
  center?: { lat: number; lng: number };
  gyms: any[];
}

const options = {
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#2c2c2c" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

export function GymMap({ center: customCenter, gyms }: GymMapProps) {
  const defaultCenter = {
    lat: 12.9716,
    lng: 77.5946,
  };

  const currentCenter = customCenter || defaultCenter;

  const { isLoaded } = useGoogleMaps();

  const [selectedGym, setSelectedGym] = useState<any>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: any) {
    if (!customCenter && gyms.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      gyms.forEach((gym) => {
        if (gym.latitude && gym.longitude) {
           bounds.extend({ lat: gym.latitude, lng: gym.longitude });
        }
      });
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [customCenter, gyms]);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentCenter}
        zoom={customCenter ? 14 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {gyms.filter(g => g.latitude && g.longitude).map((gym) => (
          <Marker
            key={gym.id}
            position={{ lat: gym.latitude, lng: gym.longitude }}
            onClick={() => setSelectedGym(gym)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            }}
          />
        ))}

        {selectedGym && (
          <InfoWindow
            position={{ lat: selectedGym.latitude, lng: selectedGym.longitude }}
            onCloseClick={() => setSelectedGym(null)}
          >
            <div className="p-2 min-w-[200px] space-y-3 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="relative h-24 w-full rounded-xl overflow-hidden">
                <img src={selectedGym.imageUrls?.[0] || ""} alt={selectedGym.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-brand-green text-[#0F172A] text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg uppercase">
                  Pass Available
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm uppercase tracking-tight">{selectedGym.name}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-brand-green text-[10px] font-bold">
                    <Star size={10} className="fill-brand-green mr-0.5" />
                    {selectedGym.avgRating || "5.0"}
                  </div>
                  <div className="text-[10px] text-zinc-500 flex items-center font-medium uppercase tracking-tighter">
                    <MapPin size={10} className="mr-0.5" />
                    {selectedGym.location.substring(0, 15)}...
                  </div>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = `/gyms/${selectedGym.id}`}
                className="w-full bg-orange-500 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1"
              >
                <span>View Details</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
